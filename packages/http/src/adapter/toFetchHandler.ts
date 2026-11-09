import type { HttpEndpointHandler } from '../endpoint/HttpEndpointHandler.js';

/**
 * Adapts an {@link HttpEndpointHandler} to the fetch signature used by Workers, Bun, Deno, Hono, Next and others.
 *
 * @example
 * const handler = toFetchHandler(client);
 *
 * app.post('/interactions', (c) => handler(c.req.raw)); // Hono
 * export default { fetch: (request, env, ctx) => handler(request, ctx) }; // Workers
 */
export function toFetchHandler(
  handler: HttpEndpointHandler,
): (
  request: Request,
  context?: { waitUntil?(promise: Promise<unknown>): void },
) => Promise<Response> {
  return async (request, context) => {
    if (request.method !== 'POST') {
      return new Response('Method not allowed.', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    const result = await handler.handle({
      body: new Uint8Array(await request.arrayBuffer()),
      signature: request.headers.get('X-Signature-Ed25519'),
      timestamp: request.headers.get('X-Signature-Timestamp'),
      raw: request,
    });

    context?.waitUntil?.(result.handled);

    return new Response(result.body === '' ? null : result.body, {
      status: result.status,
      headers: result.headers,
    });
  };
}
