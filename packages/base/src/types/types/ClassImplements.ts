/** Type of class that implements a given interface */
export type ClassImplements<Interface, Args extends any[] = any[]> = new (
  ...args: Args
) => Interface;
