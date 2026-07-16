import type {
  AutocompleteInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  MentionableSelectMenuInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserContextMenuCommandInteraction,
  UserSelectMenuInteraction,
} from 'discord.js';

class InteractionStub {
  public cmdName = 'mock';

  get commandName(): string {
    return this.cmdName;
  }

  isChatInputCommand(): boolean {
    return false;
  }

  isAutocomplete(): boolean {
    return false;
  }

  isMessageComponent(): boolean {
    return false;
  }

  isModalSubmit(): boolean {
    return false;
  }

  isUserContextMenuCommand(): boolean {
    return false;
  }

  isMessageContextMenuCommand(): boolean {
    return false;
  }

  isButton(): boolean {
    return false;
  }

  isStringSelectMenu(): boolean {
    return false;
  }

  isUserSelectMenu(): boolean {
    return false;
  }

  isRoleSelectMenu(): boolean {
    return false;
  }

  isMentionableSelectMenu(): boolean {
    return false;
  }

  isChannelSelectMenu(): boolean {
    return false;
  }
}

export class StubInteractionFactory {
  static createChatInput(commandName = 'mock'): ChatInputCommandInteraction {
    const stub = new InteractionStub();
    stub.isChatInputCommand = () => true;
    stub.cmdName = commandName;
    return stub as unknown as ChatInputCommandInteraction;
  }

  static createAutocomplete(commandName = 'mock'): AutocompleteInteraction {
    const stub = new InteractionStub();
    stub.isAutocomplete = () => true;
    stub.cmdName = commandName;
    return stub as unknown as AutocompleteInteraction;
  }

  static createButton(): ButtonInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isButton = () => true;
    return stub as unknown as ButtonInteraction;
  }

  static createStringSelectMenu(): StringSelectMenuInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isStringSelectMenu = () => true;
    return stub as unknown as StringSelectMenuInteraction;
  }

  static createUserSelectMenu(): UserSelectMenuInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isUserSelectMenu = () => true;
    return stub as unknown as UserSelectMenuInteraction;
  }

  static createRoleSelectMenu(): RoleSelectMenuInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isRoleSelectMenu = () => true;
    return stub as unknown as RoleSelectMenuInteraction;
  }

  static createMentionableSelectMenu(): MentionableSelectMenuInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isMentionableSelectMenu = () => true;
    return stub as unknown as MentionableSelectMenuInteraction;
  }

  static createChannelSelectMenu(): ChannelSelectMenuInteraction {
    const stub = new InteractionStub();
    stub.isMessageComponent = () => true;
    stub.isChannelSelectMenu = () => true;
    return stub as unknown as ChannelSelectMenuInteraction;
  }

  static createModalSubmit(): ModalSubmitInteraction {
    const stub = new InteractionStub();
    stub.isModalSubmit = () => true;
    return stub as unknown as ModalSubmitInteraction;
  }

  static createUserContextMenu(
    commandName = 'mock',
  ): UserContextMenuCommandInteraction {
    const stub = new InteractionStub();
    stub.isUserContextMenuCommand = () => true;
    stub.cmdName = commandName;
    return stub as unknown as UserContextMenuCommandInteraction;
  }

  static createMessageContextMenu(
    commandName = 'mock',
  ): MessageContextMenuCommandInteraction {
    const stub = new InteractionStub();
    stub.isMessageContextMenuCommand = () => true;
    stub.cmdName = commandName;
    return stub as unknown as MessageContextMenuCommandInteraction;
  }
}
