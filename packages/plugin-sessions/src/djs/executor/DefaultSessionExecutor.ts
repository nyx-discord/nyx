import { BasicErrorHandler } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { APIMessageTopLevelComponent } from 'discord-api-types/v10';
import type {
  MessageComponentInteraction,
  ModalMessageModalSubmitInteraction,
  TopLevelComponentData,
} from 'discord.js';
import { createComponentBuilder } from 'discord.js';
import type { SessionEndArgs } from '../../shared/types/execution/args/SessionEndArgs.js';
import type { SessionStartArgs } from '../../shared/types/execution/args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../../shared/types/execution/args/SessionUpdateArgs.js';
import { BaseSessionExecutor } from '../../shared/base/execution/executor/BaseSessionExecutor.js';
import type { SessionExecutor } from '../../shared/types/execution/executor/SessionExecutor.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';
import { SessionStartMiddlewareList } from '../../shared/base/middleware/SessionStartMiddlewareList.js';
import { SessionUpdateMiddlewareList } from '../../shared/base/middleware/SessionUpdateMiddlewareList.js';
import type { Session } from '../../shared/types/session/Session.js';

export class DefaultSessionExecutor extends BaseSessionExecutor<DjsInteractionTypes> {
  public static create(): SessionExecutor<DjsInteractionTypes> {
    return new this(
      SessionStartMiddlewareList.create<DjsInteractionTypes>(),
      SessionUpdateMiddlewareList.create<DjsInteractionTypes>(),

      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, DjsInteractionTypes>,
        SessionStartArgs
      >((_error, session) => session.getBot().getLogger()),
      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, DjsInteractionTypes>,
        SessionUpdateArgs<DjsInteractionTypes>
      >((_error, session) => session.getBot().getLogger()),
      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, DjsInteractionTypes>,
        SessionEndArgs
      >((_error, session) => session.getBot().getLogger()),
    );
  }

  protected getRawComponentRows(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
  ): APIMessageTopLevelComponent[] {
    return (
      interaction.message?.components.map((component) => component.toJSON())
      ?? []
    );
  }

  protected async updateInteraction(
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
    components: APIMessageTopLevelComponent[],
  ): Promise<void> {
    const builders = components.map((component) =>
      createComponentBuilder(component),
    );
    const update = interaction as
      MessageComponentInteraction | ModalMessageModalSubmitInteraction;
    await update.update({
      components: builders as unknown as TopLevelComponentData[],
    });
  }
}
