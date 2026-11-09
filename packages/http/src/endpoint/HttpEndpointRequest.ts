/** An object that holds the parts of a signed request from Discord that a handler needs. */
export interface HttpEndpointRequest {
  /** The raw, unparsed body, needed for signature verification. */
  body: string | Uint8Array;

  /** The `X-Signature-Ed25519` header. */
  signature: string | null | undefined;

  /** The `X-Signature-Timestamp` header. */
  timestamp: string | null | undefined;

  /** The original request object from the server or runtime (e.g. a fetch `Request` or a `node:http` `IncomingMessage`), to read anything else from it, like headers. */
  raw?: unknown;
}
