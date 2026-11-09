import type { ApplicationCommandOptionType } from 'discord-api-types/v10';

/** A definition tagged with its option type. */
type TypedDef<Def, Type extends ApplicationCommandOptionType> = Def & {
  readonly type: Type;
};

export function withType<
  const Def,
  const Type extends ApplicationCommandOptionType,
>(def: Def, type: Type): TypedDef<Def, Type> {
  return { ...def, type };
}
