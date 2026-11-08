import type { AddressInfo } from 'node:net';
import { createServer } from 'node:http';
import { describe, expect, test, vi } from 'vitest';
import type { HttpEndpointHandler } from '../../../src';
import { toFetchHandler, toNodeListener } from '../../../src';

function createHandler(): HttpEndpointHandler & {
  handle: ReturnType<typeof vi.fn>;
} {
  return {
    handle: vi.fn(() =>
      Promise.resolve({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: '{"type":1}',
      }),
    ),
  };
}

const Headers = {
  'X-Signature-Ed25519': 'signature',
  'X-Signature-Timestamp': '123',
};

describe('toFetchHandler (adapter)', () => {
  test('GIVEN a POST request WHEN handled THEN passes the raw body and signature headers', async () => {
    const handler = createHandler();
    const fetchHandler = toFetchHandler(handler);

    const response = await fetchHandler(
      new Request('http://localhost/interactions', {
        method: 'POST',
        headers: Headers,
        body: '{"type":1}',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ type: 1 });
    const [request] = handler.handle.mock.calls[0]!;
    expect(new TextDecoder().decode(request.body)).toBe('{"type":1}');
    expect(request.signature).toBe('signature');
    expect(request.timestamp).toBe('123');
  });

  test('GIVEN a result with no body WHEN handled THEN responds with no body', async () => {
    const handler = createHandler();
    handler.handle.mockResolvedValue({ status: 202, headers: {}, body: '' });

    const response = await toFetchHandler(handler)(
      new Request('http://localhost', { method: 'POST', body: '{}' }),
    );

    expect(response.status).toBe(202);
    expect(response.body).toBeNull();
  });

  test('GIVEN a GET request WHEN handled THEN returns 405 without handling', async () => {
    const handler = createHandler();

    const response = await toFetchHandler(handler)(
      new Request('http://localhost'),
    );

    expect(response.status).toBe(405);
    expect(handler.handle).not.toHaveBeenCalled();
  });
});

describe('toNodeListener (adapter)', () => {
  async function listen(handler: HttpEndpointHandler) {
    const errors: unknown[] = [];
    const listener = toNodeListener(handler);
    const server = createServer((req, res) => {
      listener(req, res).catch((error: unknown) => errors.push(error));
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    return { url: `http://127.0.0.1:${port}`, server, errors };
  }

  test('GIVEN a POST request WHEN handled THEN passes the raw body and signature headers', async () => {
    const handler = createHandler();
    const { url, server } = await listen(handler);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: Headers,
        body: '{"type":1}',
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('application/json');
      await expect(response.json()).resolves.toEqual({ type: 1 });
      const [request] = handler.handle.mock.calls[0]!;
      expect(new TextDecoder().decode(request.body)).toBe('{"type":1}');
      expect(request.signature).toBe('signature');
      expect(request.timestamp).toBe('123');
    } finally {
      server.close();
    }
  });

  test('GIVEN a GET request WHEN handled THEN returns 405 without handling', async () => {
    const handler = createHandler();
    const { url, server } = await listen(handler);

    try {
      const response = await fetch(url);

      expect(response.status).toBe(405);
      expect(handler.handle).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });

  test('GIVEN a handler that throws WHEN handled THEN responds 500 and rejects', async () => {
    const handler = createHandler();
    const error = new Error('boom');
    handler.handle.mockRejectedValue(error);
    const { url, server, errors } = await listen(handler);

    try {
      const response = await fetch(url, { method: 'POST', body: '{}' });

      expect(response.status).toBe(500);
      expect(errors).toEqual([error]);
    } finally {
      server.close();
    }
  });
});
