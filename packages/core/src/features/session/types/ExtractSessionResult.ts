import type { Session } from '../session/Session.js';

/** Utility type to extract the result type of a session. */
export type ExtractSessionResult<Of extends Session<unknown>> = ReturnType<
  Of['getResult']
>;
