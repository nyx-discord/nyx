interface PassMiddlewareResponse {
  allowed: true;

  checkNext: boolean;
}

interface DenyMiddlewareResponse {
  allowed: false;

  checkNext: false;
}

/**
 * A response of a {@link Middleware} check, allowing the execution and
 * optionally forcing the chain to finish, or denying the execution (and ending the chain).
 */
export type MiddlewareResponse =
  | PassMiddlewareResponse
  | DenyMiddlewareResponse;
