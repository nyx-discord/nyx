import { BasicErrorHandler } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { APIMessageTopLevelComponent } from 'discord-api-types/v10';
import type { SessionEndArgs } from '../../shared/types/execution/args/SessionEndArgs.js';
import type { SessionStartArgs } from '../../shared/types/execution/args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../../shared/types/execution/args/SessionUpdateArgs.js';
import { BaseSessionExecutor } from '../../shared/base/execution/executor/BaseSessionExecutor.js';
import type { SessionExecutor } from '../../shared/types/execution/executor/SessionExecutor.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';
import { SessionStartMiddlewareList } from '../../shared/base/middleware/SessionStartMiddlewareList.js';
import { SessionUpdateMiddlewareList } from '../../shared/base/middleware/SessionUpdateMiddlewareList.js';
import type { Session } from '../../shared/types/session/Session.js';

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
