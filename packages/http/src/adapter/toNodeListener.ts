import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HttpEndpointHandler } from '../endpoint/HttpEndpointHandler.js';

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Adapts an {@link HttpEndpointHandler} to a `node:http` or Express listener, which needs the unparsed body (no `express.json()` before it).
 *
 * @example
 * createServer(toNodeListener(client)).listen(3000);
 */
export function toNodeListener(
  handler: HttpEndpointHandler,
): (request: IncomingMessage, response: ServerResponse) => Promise<void> {
  return async (request, response) => {
    try {
      if (request.method !== 'POST') {
        response.writeHead(405, { Allow: 'POST' }).end('Method not allowed.');
        return;
      }

      const chunks: Uint8Array[] = [];
      for await (const chunk of request) {
        chunks.push(chunk as Uint8Array);
      }

      const result = await handler.handle({
        body: Buffer.concat(chunks),
        signature: firstHeader(request.headers['x-signature-ed25519']),
        timestamp: firstHeader(request.headers['x-signature-timestamp']),
        raw: request,
      });

      response.writeHead(result.status, result.headers).end(result.body);
    } catch (error) {
      if (!response.headersSent) {
        response.writeHead(500);
      }
      response.end();
      throw error;
    }
  };
}
