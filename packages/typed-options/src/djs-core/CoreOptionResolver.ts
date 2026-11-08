import {
  type APIApplicationCommandInteractionDataBasicOption,
  type APIApplicationCommandInteractionDataOption,
  type APIAttachment,
  type APIInteractionDataResolvedChannel,
  type APIInteractionDataResolvedGuildMember,
  type APIRole,
  type APIUser,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { CoreInteraction } from './interaction/CoreInteraction';
import type { CoreInteractionInput } from './interaction/CoreInteractionInput';

type BasicOption = APIApplicationCommandInteractionDataBasicOption;

type Resolved = NonNullable<CoreInteraction['data']['resolved']>;

function unwrap(input: CoreInteractionInput): CoreInteraction {
  // a bare interaction has a token, while event props wrap it in data
  return 'token' in input ? input : input.data;
}

function collect(
  options: readonly APIApplicationCommandInteractionDataOption[] | undefined,
): BasicOption[] {
  const collected: BasicOption[] = [];
  for (const option of options ?? []) {
    if (
      option.type === ApplicationCommandOptionType.Subcommand
      || option.type === ApplicationCommandOptionType.SubcommandGroup
    ) {
      collected.push(...collect(option.options));
    } else {
      collected.push(option);
    }
  }
  return collected;
}

/**
 * Reads options out of a raw interaction payload, descending into subcommands and looking up
 * `resolved` by id. Missing options are `null`.
 *
 * Untyped on purpose: `typedOptions` narrows it by the command data.
 */
export class CoreOptionResolver {
  protected readonly options = new Map<string, BasicOption>();

  protected readonly resolved: CoreInteraction['data']['resolved'];

  constructor(input: CoreInteractionInput) {
    const interaction = unwrap(input);
    this.resolved = interaction.data.resolved;
    for (const option of collect(interaction.data.options)) {
      this.options.set(option.name, option);
    }
  }

  public getString(name: string): string | null {
    return this.getRaw(name, ApplicationCommandOptionType.String) as
      string | null;
  }

  public getInteger(name: string): number | null {
    return this.getRaw(name, ApplicationCommandOptionType.Integer) as
      number | null;
  }

  public getNumber(name: string): number | null {
    return this.getRaw(name, ApplicationCommandOptionType.Number) as
      number | null;
  }

  public getBoolean(name: string): boolean | null {
    return this.getRaw(name, ApplicationCommandOptionType.Boolean) as
      boolean | null;
  }

  public getUser(name: string): APIUser | null {
    return this.resolve(name, ApplicationCommandOptionType.User, 'users');
  }

  public getMember(name: string): APIInteractionDataResolvedGuildMember | null {
    return this.resolve(name, ApplicationCommandOptionType.User, 'members');
  }

  public getChannel(name: string): APIInteractionDataResolvedChannel | null {
    return this.resolve(name, ApplicationCommandOptionType.Channel, 'channels');
  }

  public getRole(name: string): APIRole | null {
    return this.resolve(name, ApplicationCommandOptionType.Role, 'roles');
  }

  public getMentionable(name: string): APIUser | APIRole | null {
    return (
      this.resolve(name, ApplicationCommandOptionType.Mentionable, 'users')
      ?? this.resolve(name, ApplicationCommandOptionType.Mentionable, 'roles')
    );
  }

  public getAttachment(name: string): APIAttachment | null {
    return this.resolve(
      name,
      ApplicationCommandOptionType.Attachment,
      'attachments',
    );
  }

  protected getRaw(
    name: string,
    type: ApplicationCommandOptionType,
  ): BasicOption['value'] | null {
    const option = this.options.get(name);
    return option && option.type === type ? option.value : null;
  }

  protected resolve<Key extends keyof Resolved>(
    name: string,
    type: ApplicationCommandOptionType,
    key: Key,
  ): NonNullable<Resolved[Key]>[string] | null {
    const id = this.getRaw(name, type);
    if (typeof id !== 'string') return null;

    const entities = this.resolved?.[key] as
      Record<string, NonNullable<Resolved[Key]>[string]> | undefined;
    return entities?.[id] ?? null;
  }
}
