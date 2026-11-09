/** An object that holds the HTTP response to send back to Discord. */
export interface HttpEndpointResult {
  status: number;

  headers: Record<string, string>;

  /** The response body, empty when there's none. */
  body: string;

  /** Settles once the request's handlers finish, which can be after the response is sent. Pass it to your runtime's `waitUntil()` on serverless platforms. */
  handled: Promise<void>;
}
