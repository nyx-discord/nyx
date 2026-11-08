/** The definition of an API option: the option itself, minus the fields the option helpers fill in */
export type DefOf<Option> = Option extends unknown
  ? Omit<Option, 'name' | 'type'>
  : never;
