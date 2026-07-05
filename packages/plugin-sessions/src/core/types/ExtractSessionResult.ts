import type { Session } from '../session/Session';

/** Utility type to extract the result type of a session. */
export type ExtractSessionResult<Of extends Session<unknown>> = ReturnType<
  Of['getResult']
>;
