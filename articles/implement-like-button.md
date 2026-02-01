---
title: ブログにいいねボタンを実装した
excerpt: いいねボタンをフロントエンド・バックエンドの両面で設計・実装した記録です。
publishedAt: 2026-02-01T10:30:00.000Z
categories:
  - 技術
tags:
  - React
  - Astro
  - TypeScript
  - Cloudflare Workers
---

このブログにいいねボタンを実装しました。以下の構成で実装しています。

```text
LikeButton (UI)
↓
React custom hooks (SWRフック、楽観的更新、デバウンス + バッファリング)
↓
POST /api/likes/[id] (Astro APIエンドポイント)
↓
PostgreSQL
```

フロントエンドはReactコンポーネントとカスタムフックを組み合わせて、APIリクエストとUI更新を担い、バックエンドはAstroのAPI Routesを使っていいね周りのAPIを実装し、PostgreSQLを使ってデータを永続化しています。

## なぜ実装したのか

ブログ記事を読んだ人から反応が欲しかったためです。

いいね機能は、コメント機能と比較して、読者が手軽に反応を示せる手段だと考えています。読者は「参考になった」「面白かった」という気持ちをワンクリックで伝えられます。また、書き手である自分にとっても、どの記事が読者に響いているかを把握する指標になる可能性があると考えました。

### いいねボタンを連打可能にした理由

実装にあたっては、ログイン不要で読者が何度でもいいねできる仕様にしました。気軽に連打できる体験をさせたかったのと、個人ブログにわざわざログインをする人はいないと考えたためです。

### 完璧を求めない判断

また「いいね数が多少失われても問題ない」という前提で設計しました。

たとえば、いいねのリクエストのリトライキューの実装にlocalStorageではなくsessionStorageを使っています。いいねの送信や反映が失敗して無かったことになったとしても、不要なリトライキューがブラウザーに残り続け、リクエストが繰り返されてしまうことを防ぐようにしました。

## フロントエンドの実装

まずはフロントエンドの実装から見ていきましょう。

### LikeButtonコンポーネント

いいねボタン用のコンポーネントは、React組み込みのフックやカスタムフックを組み合わせて、拍手アイコンといいね数を表示している構成です。

Astroのコンポーネントでコンポーネントを作らなかった理由は、[Share state between Astro components | Docs](https://docs.astro.build/en/recipes/sharing-state/)というドキュメントを見て、Astroで状態を管理するためにNano Storesというライブラリを導入しないといけないことを知り、それが若干面倒に感じたためです。

では実装を見ていきましょう。

```tsx
export function LikeButton({ entryId, likeLabel, onClick }: Props): React.JSX.Element {
  // 状態・カスタムフック定義
  const [clapping, setClapping] = useState(false);
  const { counts, handleLikes, isLoading } = useLikes({ entryId });
  // ...
```

`clapping` はクリック時に表示するアニメーション用の状態です。`useLikes` フックではいいねの数と操作用のハンドラーを定義しています。

```tsx
// ...
const handleClick = useCallback(() => {
  handleLikes();

  setClapping(false);
  requestAnimationFrame(() => {
    setClapping(true);
  });

  onClick?.();
}, [handleLikes, onClick]);
// ...
```

クリック時に `requestAnimationFrame` を使い、アニメーションが毎回実行されるようにしています。

```tsx
  // ...
  return (
    <div className={styles.container}>
      <button type="button" className={styles.button} aria-label={likeLabel} onClick={handleClick}>
        <span className={clsx(styles.clap, clapping && styles.clapping)}>
          {/* アイコン */}
        </span>
      </button>
      <span className={styles.count} aria-live="polite">
        {counts}
      </span>
    </div>
  );
}
```

いいね数を表示する要素に対して `aria-live="polite"` を指定することで、いいね数をスクリーンリーダーで読まれるようにしています。

### 楽観的UI更新

ユーザーがいいねボタンをクリックした瞬間に、サーバーからのレスポンスを待たずにUIを更新しています。

データ取得にはSWRを使っています。TanStack Queryを使うことも考えましたが、今回はいいね数の取得とUIの更新に使うだけなので、APIがシンプルなSWRで十分と判断しました。

まずSWRを使っていいね数を取得し、バッファリング用のカスタムフックを読み込みます。

```tsx
export function useLikes({ entryId }: UseLikeParams): UseLikeReturn {
  const { data, isLoading, mutate } = useSWR<LikesOnGetResponse | null>(
    `/api/likes/${entryId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { updateLikeCounts } = useLikesBuffer();
  // ...
```

タブがフォーカスされた時やネットワーク再接続時の自動再検証は必要ないので、`useSWR` のオプションに `revalidateOnFocus: false` と `revalidateOnReconnect: false` を指定しています。

いいねボタンがクリックされた時のハンドラー定義は以下の通りです。

```tsx
  // ...
  const handleLikes = useCallback(() => {
    // 即座にUI更新
    void mutate({
      id: entryId,
      counts: countsRef.current + 1
    }, { revalidate: false });
    // バッファに追加
    updateLikeCounts(entryId, 1);
  }, [entryId, mutate, updateLikeCounts]);

  return { counts: countsRef.current, handleLikes, isLoading };
}
```

SWRの `mutate` 関数を使ってローカルのキャッシュを即座に更新しています。`revalidate: false` でサーバーへの再検証リクエストを抑制しています。同時に `updateLikeCounts` でバッファにいいねの回数を追加し、後でまとめてリクエストをするようにしています。

### バッファリングによるリクエスト最適化

いいねボタンを連打した場合、ボタンを押した回数分そのままAPIリクエストした場合に、無駄なリクエストが増え、サーバーとユーザーどちらにも嬉しくない事態になります。そこで一定時間内はいいねボタンの押した回数をバッファリングしておき、いいねを押した回数だけいいね数を加算してリクエストを送信するようにしています。

以下のコードでは、バッファリング用の定数とrefを定義しています。

```tsx
const FLUSH_TIMER = 1_000;

export function useLikesBuffer(): UseLikeBufferReturn {
  const bufferedIncrementsRef = useRef<Map<string, number>>(new Map());
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ...
```

`bufferedIncrementsRef` は記事IDごとのいいね数の増分を保持し、`debounceTimerRef` はデバウンス用のタイマーを管理しています。

いいね数を更新する関数は以下の通り定義します。

```tsx
  // ...
  const updateLikeCounts = useCallback((entryId: string, increment: number) => {
    // 現在のバッファに増分を加算
    const currentIncrement = bufferedIncrementsRef.current.get(entryId) ?? 0;
    bufferedIncrementsRef.current.set(entryId, currentIncrement + increment);

    // 既存のタイマーをクリア
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }
    // ...
```

いいねボタンが押されるたびにタイマーをリセットすることで、連打中はリクエストを送信しないようにして、連打が止まってから送信されるようにしています。

最後に、タイマーを発火してバッファに溜めたいいねの数をサーバーに送信します。

```tsx
    // ...
    debounceTimerRef.current = setTimeout(() => {
      const totalIncrement = bufferedIncrementsRef.current.get(entryId) ?? 0;
      bufferedIncrementsRef.current.delete(entryId);
      void sendLikes(entryId, totalIncrement);
    }, FLUSH_TIMER);
  }, []);

  return { updateLikeCounts };
}
```

ここまでの実装によって、1秒以内に5回いいねボタンを押された場合に5回リクエストするのではなく、payloadに `increment: 5` というobjectが入った状態のリクエストにまとめられます。デバウンスの間隔は実際に連打してみて、1秒くらいが「連打が止まった」と判断するのにちょうど良い体感でした。

### リトライキューの実装

ネットワークエラーでリクエストが失敗した場合を考慮して、sessionStorageにリトライキューを保存しています。

```tsx
export function saveToRetryQueue(entryId: string, increment: number): void {
  const storage = getStorage();
  if (storage == null) {
    return;
  }

  const queue = loadRetryQueue();
  queue.push({ entryId, increment, timestamp: Date.now() });
  storage.setItem(LIKE_SEND_RETRY_QUEUE_KEY, JSON.stringify(queue));
}
```

ページを再読み込みした時にリトライキューを読み込み、失敗したリクエストを再送信しています。

## バックエンドの実装

次にバックエンドの実装を見ていきます。

### いいね数を保存するためのテーブル定義

Drizzleを使って以下のように定義しています。

```tsx
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  entryId: varchar('entry_id', { length: 255 }).notNull().unique(),
  counts: integer('counts').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

記事IDにはユニーク制約を付けていて、記事ごとに1レコードとなります。PostgreSQLのホスティングは[Neon](https://neon.com/)を使っています。無料枠の存在が決め手でしたが、無料枠がなくなった場合は料金次第で移行するかもしれません。

### APIエンドポイント

AstroのAPI Routesを使って、GETとPOSTのエンドポイントを実装しています。

```tsx
// GET: いいね数の取得
export async function GET({ locals, params, request }: APIContext): Promise<Response> {
  const { id } = params;
  if (!isValidEntryIdFormat(id)) {
    return createClientErrorResponse({ type: 'invalidEntryId' });
  }

  const exists = await entryExists(id);
  if (!exists) {
    return createClientErrorResponse({ type: 'entryNotFound' });
  }

  const counts = await getLikeCounts({ context: locals, entryId: id });
  return new Response(JSON.stringify({ id, counts }), { status: 200 });
}
```

### いいね数の登録・更新

いいね数の登録・更新には、Drizzleで定義されている `onConflictDoUpdate`（いわゆるUpsert）を使っています。

```tsx
export async function incrementLikeCounts({ context, entryId, increment }: IncrementParams): Promise<number> {
  const db = getDbClient(context);

  const result = await db
    .insert(likes)
    .values({ counts: increment, entryId })
    .onConflictDoUpdate({
      target: [likes.entryId],
      set: {
        counts: sql`${likes.counts} + ${increment}`,
        updatedAt: new Date(),
      },
    })
    .returning({ counts: likes.counts });

  return result[0]?.counts ?? 0;
}
```

### Cloudflare Cache APIによるキャッシュ

GETリクエストの結果はCloudflare Cache APIを使ってエッジでキャッシュしています。

```tsx
const cache = locals.runtime?.caches?.default ?? null;
const cacheKey = createNormalizedCacheKey(request);

const cachedResponse = await cache?.match(cacheKey);
if (cachedResponse != null) {
  return new Response(await cachedResponse.text(), {
    status: cachedResponse.status,
    headers: cachedResponse.headers,
  });
}
```

POSTリクエストでいいね数が更新された際には、該当するキャッシュを削除して、次回のGETで最新の値が取得されるようにしています。

## セキュリティ対策

セキュリティ対策の一部は、AIエージェントに指摘されて追加しました。自分だけでは見落としていた観点です。

入力値のバリデーションと記事IDの検証は、AIエージェントからの指摘で「確かにDevToolsやcURLによるリクエストでゴミデータが増えたり、不正にいいね数が増えたりする」と認識しました。

### レート制限

Cloudflare WorkersのRate Limiting APIを使って、短時間での大量リクエストを制限しています。

```tsx
export async function checkRateLimit({ clientIp, entryId, rateLimiter }: Params): Promise<boolean> {
  try {
    const rateLimitKey = JSON.stringify({ clientIp, entryId });
    const { success } = await rateLimiter.limit({ key: rateLimitKey });
    return !success;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }
}
```

### 入力値のバリデーション

リクエストボディのバリデーションにはValibotを使用しています。バリデーションを実装する過程で[AstroではZodをデフォルトで使える](https://docs.astro.build/en/reference/modules/astro-zod/)ことに気付きましたが、見ないふりをしました。

```tsx
export const likesOnPostRequestSchema = object({
  increment: pipe(
    number(),
    integer(),
    minValue(1, 'Increment must be at least 1'),
    maxValue(MAX_INCREMENT_VALUE, `Increment must be at most ${MAX_INCREMENT_VALUE}`),
  ),
});
```

### 記事IDの検証

存在しない記事IDに対するリクエストを弾くため、記事IDの形式チェックと存在確認を行っています。

```tsx
const MAX_ENTRY_ID_LENGTH = 100;
const ENTRY_ID_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

// 形式チェック：100文字以下の英小文字、数字、ハイフンのみ許可
export function isValidEntryIdFormat(id: string | undefined): id is string {
  if (id == null || id === '' || id.length > MAX_ENTRY_ID_LENGTH) {
    return false;
  }
  return ENTRY_ID_PATTERN.test(id);
}

// 記事の存在確認
export async function entryExists(entryId: string, getEntryFn: GetEntryFn): Promise<boolean> {
  const entry = await getEntryFn('entries', entryId);
  return entry !== undefined;
}
```

## まとめ

今回のいいねボタンの実装では個人ブログという規模に合わせた判断をしました。「いいねボタンを連打可能にする」のはその1つです。

一方で実装するにあたってAIエージェントも使ってさまざまな点を考慮しました。たとえば以下の点です。

- 楽観的UI更新による即時フィードバック
- バッファリングによるAPIリクエストの最適化
- レート制限と入力値バリデーションによるセキュリティ対策
- sessionStorageを使うことで、不要なデータの残留を防ぐ

こういったどのように実装するか自分ですべて判断し実装できるという点で、個人ブログの開発は面白いです。
