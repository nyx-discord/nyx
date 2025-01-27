import type { SessionEndCode } from './SessionEndCode';

/** Type of data about a session's end. */
export type SessionEndData<Result> = {
  reason: string;
  code: SessionEndCode;
  result: Result | null;
};
