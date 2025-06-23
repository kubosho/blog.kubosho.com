// Cloudflare Workers環境のモック
import { vi } from 'vitest';

// cloudflare:workersモジュールのモック
vi.mock('cloudflare:workers', () => ({
  default: {}
}));

// Cloudflareグローバル変数のモック（必要に応じて）
global.fetch = global.fetch || vi.fn();