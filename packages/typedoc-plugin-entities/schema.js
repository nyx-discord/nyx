import { object, record, string, url } from 'zod';

export const Schema = record(
  string(),
  object({
    typedoc: string(),
    github: url(),
  }),
);
