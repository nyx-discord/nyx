import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { APIMessageTopLevelComponent } from 'discord-api-types/v10';
import { BasicErrorHandler } from '@nyx-discord/base';
import type { SessionExecutor } from '../../shared/execution/executor/SessionExecutor.js';
import { BaseSessionExecutor } from '../../shared/execution/executor/BaseSessionExecutor.js';
import type { SessionEndArgs } from '../../shared/execution/args/SessionEndArgs.js';
import type { SessionStartArgs } from '../../shared/execution/args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../../shared/execution/args/SessionUpdateArgs.js';
import type { SessionUpdateInteraction } from '../../shared/interaction/SessionUpdateInteraction.js';
import { SessionStartMiddlewareList } from '../../shared/middleware/SessionStartMiddlewareList.js';
import { SessionUpdateMiddlewareList } from '../../shared/middleware/SessionUpdateMiddlewareList.js';
import type { Session } from '../../shared/session/Session.js';

export class DefaultSessionExecutor extends BaseSessionExecutor<CoreInteractionTypes> {
  public static create(): SessionExecutor<CoreInteractionTypes> {
    return new this(
      SessionStartMiddlewareList.create<CoreInteractionTypes>(),
      SessionUpdateMiddlewareList.create<CoreInteractionTypes>(),

      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, CoreInteractionTypes>,
        SessionStartArgs
      >((_error, session) => session.getBot().getLogger()),
      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, CoreInteractionTypes>,
        SessionUpdateArgs<CoreInteractionTypes>
      >((_error, session) => session.getBot().getLogger()),
      BasicErrorHandler.createWithFallbackLogger<
        Session<unknown, CoreInteractionTypes>,
        SessionEndArgs
      >((_error, session) => session.getBot().getLogger()),
    );
  }

  protected getRawComponentRows(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
  ): APIMessageTopLevelComponent[] {
    return interaction.data.message?.components ?? [];
  }

  protected async updateInteraction(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
    components: APIMessageTopLevelComponent[],
  ): Promise<void> {
    await interaction.api.interactions.updateMessage(
      interaction.data.application_id,
      interaction.data.token,
      { components },
    );
  }
}
