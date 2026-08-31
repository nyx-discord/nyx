import {
  BasicEventBus,
  DefaultMetadataFactory,
  ensureKey,
} from '@nyx-discord/base';
import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { AnyEventSubscriber } from '@nyx-discord/types';
import { DefaultSessionCustomIdCodec } from '../../shared/base/customId/DefaultSessionCustomIdCodec.js';
import type { SessionEventArgs } from '../../shared/types/events/SessionEvent.js';
import type { AnySessionInteraction } from '../../shared/types/interaction/AnySessionInteraction.js';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';
import type { SessionInteractionMeta } from '../../shared/types/interaction/SessionInteractionMeta.js';
import type { SessionPluginCreateOptions } from '../../shared/base/plugin/BaseSessionPlugin.js';
import { BaseSessionPlugin } from '../../shared/base/plugin/BaseSessionPlugin.js';
import { DefaultSessionPromiseRepository } from '../../shared/base/promise/DefaultSessionPromiseRepository.js';
import { DefaultSessionRepository } from '../../shared/base/repository/DefaultSessionRepository.js';
import { DefaultSessionUpdateSubscriber } from '../event/DefaultSessionUpdateSubscriber.js';
import { DefaultSessionExecutor } from '../executor/DefaultSessionExecutor.js';

export class CoreSessionPlugin extends BaseSessionPlugin<CoreInteractionTypes> {
  public static create(
    options?: SessionPluginCreateOptions<CoreInteractionTypes>,
  ): CoreSessionPlugin {
    const constructorOptions = options?.injections ?? {};
    const metaFactory = new DefaultMetadataFactory();

    ensureKey(constructorOptions, 'executor', DefaultSessionExecutor.create());
    ensureKey(
      constructorOptions,
      'repository',
      DefaultSessionRepository.create<CoreInteractionTypes>(),
    );
    ensureKey(
      constructorOptions,
      'promiseRepository',
      DefaultSessionPromiseRepository.create<CoreInteractionTypes>(),
    );
    ensureKey(
      constructorOptions,
      'subscriber',
      new DefaultSessionUpdateSubscriber() as unknown as AnyEventSubscriber,
    );
    ensureKey(
      constructorOptions,
      'customIdCodec',
      DefaultSessionCustomIdCodec.create(),
    );
    ensureKey(
      constructorOptions,
      'bus',
      BasicEventBus.createAsync<SessionEventArgs<CoreInteractionTypes>>(
        metaFactory,
      ),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    const plugin = new this({ ...constructorOptions });

    constructorOptions.repository.setExpirationCallback(
      plugin.expire.bind(plugin),
    );

    return plugin;
  }

  protected override getCustomId(
    interaction: SessionUpdateInteraction<CoreInteractionTypes>,
  ): string {
    return interaction.data.data.custom_id;
  }

  protected override getInteractionMeta(
    interaction: AnySessionInteraction<CoreInteractionTypes>,
  ): SessionInteractionMeta {
    return { id: interaction.data.id, type: interaction.data.type };
  }
}
