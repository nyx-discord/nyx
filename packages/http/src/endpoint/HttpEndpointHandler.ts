import type { HttpEndpointRequest } from './HttpEndpointRequest.js';
import type { HttpEndpointResult } from './HttpEndpointResult.js';

/** An object that turns a signed request from Discord (an interaction or a webhook event) into the HTTP response to send back. */
export interface HttpEndpointHandler {
  /** Handles a request, returning the response to send back to Discord. */
  handle(request: HttpEndpointRequest): Promise<HttpEndpointResult>;
}
