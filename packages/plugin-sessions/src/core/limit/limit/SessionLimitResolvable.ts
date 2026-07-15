import type { SessionLimit } from './SessionLimit';
import type { SessionLimitBuilder } from './SessionLimitBuilder';

/** Type that can be resolved to a {@link SessionLimit}. */
export type SessionLimitResolvable = SessionLimit | SessionLimitBuilder;
