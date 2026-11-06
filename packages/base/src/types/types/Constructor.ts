/** Type of Class constructor. */
export type Constructor<Built = unknown> = new (...args: any[]) => Built;
