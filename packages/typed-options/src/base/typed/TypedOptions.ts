import type {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ChannelType,
} from 'discord-api-types/v10';
import type { OptionRecord } from '../definition/OptionRecord.js';
import type { ValueMap } from './ValueMap.js';

type NamesOf<Options, Type extends ApplicationCommandOptionType> = {
  [Name in keyof Options]: Options[Name] extends { readonly type: Type }
    ? Name
    : never;
}[keyof Options]
  & string;

/** `Value` when the option is required, `Value | null` otherwise. */
type NullableUnlessRequired<
  Options,
  Name extends keyof Options,
  Value,
> = Options[Name] extends {
  readonly required: true;
}
  ? Value
  : Value | null;

/** The union of the option's choice values, or `Value` when it has no choices. */
type Narrow<
  Options,
  Name extends keyof Options,
  Value,
> = Options[Name] extends {
  readonly choices: readonly APIApplicationCommandOptionChoice<infer Choices>[];
}
  ? Choices
  : Value;

type ChannelTypesOf<Def> = Def extends {
  readonly channel_types: readonly (infer Types)[];
}
  ? Types
  : ChannelType;

/** Getters checked against the option definitions `Options` by name and kind, returning the `Values` of a library. */
export interface TypedOptions<
  Options extends OptionRecord,
  Values extends ValueMap,
> {
  getString<Name extends NamesOf<Options, ApplicationCommandOptionType.String>>(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Narrow<Options, Name, string>>;

  getInteger<
    Name extends NamesOf<Options, ApplicationCommandOptionType.Integer>,
  >(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Narrow<Options, Name, number>>;

  getNumber<Name extends NamesOf<Options, ApplicationCommandOptionType.Number>>(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Narrow<Options, Name, number>>;

  getBoolean<
    Name extends NamesOf<Options, ApplicationCommandOptionType.Boolean>,
  >(
    name: Name,
  ): NullableUnlessRequired<Options, Name, boolean>;

  getUser<Name extends NamesOf<Options, ApplicationCommandOptionType.User>>(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Values['user']>;

  getMember<Name extends NamesOf<Options, ApplicationCommandOptionType.User>>(
    name: Name,
  ): Values['member'] | null;

  getChannel<
    Name extends NamesOf<Options, ApplicationCommandOptionType.Channel>,
  >(
    name: Name,
  ): NullableUnlessRequired<
    Options,
    Name,
    Values['channel'] & { readonly type: ChannelTypesOf<Options[Name]> }
  >;

  getRole<Name extends NamesOf<Options, ApplicationCommandOptionType.Role>>(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Values['role']>;

  /** A user, member or role. */
  getMentionable<
    Name extends NamesOf<Options, ApplicationCommandOptionType.Mentionable>,
  >(
    name: Name,
  ): NullableUnlessRequired<
    Options,
    Name,
    Values['user'] | Values['member'] | Values['role']
  >;

  getAttachment<
    Name extends NamesOf<Options, ApplicationCommandOptionType.Attachment>,
  >(
    name: Name,
  ): NullableUnlessRequired<Options, Name, Values['attachment']>;
}
