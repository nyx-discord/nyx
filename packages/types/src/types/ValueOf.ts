/** Union type representing every value on a given T. Counterpart of `keyof`. */
export type ValueOf<T> = T[keyof T];
