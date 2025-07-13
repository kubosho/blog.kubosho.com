import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import type { ApiEnv } from '../index';
import { logging } from './logging';

describe('Logging middleware', () => {
  it('should log request and response information', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const api = new Hono<ApiEnv>();
    
    // Apply logging middleware
    api.use('*', logging());
    
    api.get('/test', (c) => {
      return c.json({ message: 'test' }, 200);
    });

    const res = await api.request('/test', {
      method: 'GET',
      headers: {
        'User-Agent': 'test-agent',
      },
    });
    
    expect(res.status).toBe(200);
    
    // Check that console.log was called with request info
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'info',
      method: 'GET',
      path: '/test',
      status: 200,
      duration: expect.any(Number),
      userAgent: 'test-agent',
    }));
    
    consoleSpy.mockRestore();
  });

  it('should log errors when requests fail', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const api = new Hono<ApiEnv>();
    
    // Apply logging middleware
    api.use('*', logging());
    
    api.get('/error', () => {
      throw new Error('Test error');
    });

    // Add error handler to prevent test from failing
    api.onError((err, c) => {
      return c.json({ error: err.message }, 500);
    });

    const res = await api.request('/error');
    
    expect(res.status).toBe(500);
    
    // Since the error is caught by the error handler, 
    // the logging middleware will log it as a successful response with status 500
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'info',
      method: 'GET',
      path: '/error',
      status: 500,
      duration: expect.any(Number),
    }));
    
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});