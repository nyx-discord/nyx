/** An object used by a bot to log information. */
export interface NyxLogger {
  log: (...args: any[]) => unknown;
  trace: (...args: any[]) => unknown;
  debug: (...args: any[]) => unknown;
  info: (...args: any[]) => unknown;
  warn: (...args: any[]) => unknown;
  error: (...args: any[]) => unknown;
}
