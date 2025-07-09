# Sentry.ts テストケース仕様書

## 概要

このドキュメントは、`api/src/utils/sentry.ts`モジュールのテストケースを定義します。

### テスト対象
- **ファイル**: `api/src/utils/sentry.ts`
- **主要機能**: Cloudflare Workers環境でのエラートラッキング
- **依存関係**: `@sentry/cloudflare`

### テストの目的
1. エラートラッキングの信頼性確保
2. 環境別の適切な動作保証
3. セキュリティとプライバシーの検証
4. フォールバック処理の確認

## テストケース一覧

### 1. initSentryImpl

#### 正常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| ISI-001 | DSNが提供された場合の初期化 | Sentry.initが正しい設定で呼ばれる | 高 |
| ISI-002 | ENVIRONMENT未設定時のデフォルト値 | environment: 'development'が設定される | 中 |
| ISI-003 | RELEASE_VERSION未設定時のデフォルト値 | release: 'unknown'が設定される | 中 |
| ISI-004 | production環境でのサンプリングレート | tracesSampleRate: 0.1が設定される | 高 |
| ISI-005 | 非production環境でのサンプリングレート | tracesSampleRate: 1.0が設定される | 中 |

#### 異常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| ISI-E01 | DSNが未設定の場合 | console.warnが呼ばれ、初期化されない | 高 |
| ISI-E02 | DSNが空文字の場合 | console.warnが呼ばれ、初期化されない | 高 |
| ISI-E03 | DSNがundefinedの場合 | console.warnが呼ばれ、初期化されない | 高 |

### 2. captureExceptionImpl

#### 正常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| CEI-001 | 基本的なエラーキャプチャ | Sentry.captureExceptionが呼ばれる | 高 |
| CEI-002 | extraコンテキストの設定 | scope.setExtraが各key-valueで呼ばれる | 中 |
| CEI-003 | tagsの設定 | scope.setTagが各key-valueで呼ばれる | 中 |
| CEI-004 | userコンテキストの設定 | scope.setUserが正しく呼ばれる | 中 |
| CEI-005 | HonoContextからのリクエスト情報抽出 | URL、メソッド、ヘッダー、IPが設定される | 高 |
| CEI-006 | CF-Connecting-IPヘッダーの優先処理 | CF-Connecting-IPが優先的に使用される | 中 |
| CEI-007 | X-Forwarded-Forへのフォールバック | CF-Connecting-IPがない場合、X-Forwarded-Forが使用される | 中 |

#### 異常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| CEI-E01 | Sentry未初期化時 | console.errorが呼ばれ、エラーがログ出力される | 高 |
| CEI-E02 | Error以外のオブジェクト（string） | 正常に処理される | 中 |
| CEI-E03 | Error以外のオブジェクト（number） | 正常に処理される | 低 |
| CEI-E04 | null/undefinedのエラー | 正常に処理される | 中 |

#### セキュリティ関連テストケース

| ID | テストケース | 懸念事項 | 優先度 |
|---|---|---|---|
| CEI-S01 | 認証ヘッダーの送信 | Authorizationヘッダーが含まれるリスク | 高 |
| CEI-S02 | Cookieの送信 | セッション情報の漏洩リスク | 高 |
| CEI-S03 | カスタムヘッダーの送信 | 内部情報の漏洩リスク | 中 |

### 3. captureMessageImpl

#### 正常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| CMI-001 | デフォルトレベルでのメッセージ送信 | level: 'info'で送信される | 中 |
| CMI-002 | 各レベルでのメッセージ送信 | 指定したレベルで送信される | 中 |

#### 異常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| CMI-E01 | Sentry未初期化時 | console.logで適切なレベル表示 | 高 |

### 4. addBreadcrumbImpl

#### 正常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| ABI-001 | 必須フィールドのみ | messageとtimestampが設定される | 中 |
| ABI-002 | categoryのデフォルト値 | category: 'custom'が設定される | 低 |
| ABI-003 | levelのデフォルト値 | level: 'info'が設定される | 低 |
| ABI-004 | dataフィールドの設定 | dataが正しく含まれる | 中 |
| ABI-005 | timestampの計算 | Date.now() / 1000が正しく設定される | 中 |

#### 異常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| ABI-E01 | Sentry未初期化時 | エラーなく処理が終了する | 中 |

### 5. sentryMiddleware

#### 正常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| SM-001 | エラーなしの正常処理 | next()が呼ばれ、正常終了 | 高 |
| SM-002 | エラー発生時のキャプチャ | captureExceptionが呼ばれる | 高 |
| SM-003 | エラー時のタグ設定 | pathとmethodがtagsに含まれる | 中 |

#### 異常系テストケース

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| SM-E01 | エラーの再スロー | 元のエラーが再スローされる | 高 |

### 6. DIパターンのテスト

| ID | テストケース | 期待結果 | 優先度 |
|---|---|---|---|
| DI-001 | sentryオブジェクトの関数置き換え | 各関数が個別にモック可能 | 高 |
| DI-002 | 後方互換性（名前付きエクスポート） | 既存のimportが動作する | 高 |

## 実装例

### 基本的なモックパターン

```typescript
import { vi } from 'vitest';
import { sentry } from './sentry';

describe('sentry utils', () => {
  beforeEach(() => {
    // sentryオブジェクトの関数を直接モック
    sentry.initSentry = vi.fn();
    sentry.captureException = vi.fn();
    sentry.captureMessage = vi.fn();
    sentry.addBreadcrumb = vi.fn();
  });

  it('should mock sentry functions', () => {
    const error = new Error('Test error');
    sentry.captureException(error);
    
    expect(sentry.captureException).toHaveBeenCalledWith(error);
  });
});
```

### Sentry SDKのモック

```typescript
vi.mock('@sentry/cloudflare', () => ({
  getCurrentScope: vi.fn(),
  withScope: vi.fn((callback) => {
    const mockScope = {
      setExtra: vi.fn(),
      setTag: vi.fn(),
      setUser: vi.fn(),
      setContext: vi.fn(),
    };
    callback(mockScope);
  }),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
  init: vi.fn(),
}));
```

### 統合テストの例

```typescript
describe('sentryMiddleware integration', () => {
  it('should capture and rethrow errors', async () => {
    const mockContext = {
      req: {
        path: '/test',
        method: 'GET',
      },
    };
    
    const error = new Error('Test error');
    const next = vi.fn().mockRejectedValue(error);
    
    await expect(
      sentryMiddleware(mockContext as any, next)
    ).rejects.toThrow(error);
    
    expect(sentry.captureException).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        tags: {
          path: '/test',
          method: 'GET',
        },
      })
    );
  });
});
```

## 注意事項

### セキュリティ上の懸念

1. **ヘッダー情報の送信**
   - 現在の実装では全てのヘッダーがSentryに送信される
   - 認証情報や機密データが含まれる可能性がある
   - ホワイトリスト方式への変更を検討すべき

2. **IPアドレスの取得**
   - CF-Connecting-IPとX-Forwarded-Forの信頼性
   - なりすましの可能性を考慮

### パフォーマンスへの影響

1. **初期化の頻度**
   - 現在はリクエストごとに初期化チェックが実行される
   - 初期化状態のキャッシュを検討

2. **スコープの作成**
   - withScopeは新しいスコープを作成するため、オーバーヘッドがある

### 将来の拡張性

1. **エラートラッキングサービスの切り替え**
   - 現在のDIパターンにより、他のサービスへの移行が容易

2. **環境別の設定**
   - 開発環境でのより詳細なログ出力
   - ステージング環境での特別な設定

## テスト実行時の推奨事項

1. **環境変数のリセット**
   ```typescript
   beforeEach(() => {
     delete process.env.SENTRY_DSN;
     delete process.env.ENVIRONMENT;
     delete process.env.RELEASE_VERSION;
   });
   ```

2. **console出力の検証**
   ```typescript
   const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
   // テスト実行
   expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Sentry DSN not configured'));
   consoleSpy.mockRestore();
   ```

3. **並行実行の考慮**
   - グローバルな状態を持たないようにテストを設計
   - 各テストが独立して実行可能であることを確認