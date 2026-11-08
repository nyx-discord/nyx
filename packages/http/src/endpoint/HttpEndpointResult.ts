/** An object that holds the HTTP response to send back to Discord. */
export interface HttpEndpointResult {
  status: number;

  headers: Record<string, string>;

  /** The response body, empty when there's none. */
  body: string;
}
