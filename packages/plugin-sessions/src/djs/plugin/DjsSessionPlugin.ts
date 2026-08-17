import {
  BasicEventBus,
  DefaultMetadataFactory,
  ensureKey,
} from '@nyx-discord/base';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { AnyEventSubscriber } from '@nyx-discord/types';
import { DefaultSessionCustomIdCodec } from '../../shared/customId/DefaultSessionCustomIdCodec.js';
import type { SessionEventArgs } from '../../shared/events/SessionEvent.js';
import type { AnySessionInteraction } from '../../shared/interaction/AnySessionInteraction.js';
import type { SessionInteractionMeta } from '../../shared/interaction/SessionInteractionMeta.js';
import type { SessionUpdateInteraction } from '../../shared/interaction/SessionUpdateInteraction.js';
import { BaseSessionPlugin } from '../../shared/plugin/BaseSessionPlugin.js';
import type { SessionPluginCreateOptions } from '../../shared/plugin/BaseSessionPlugin.js';
import { DefaultSessionPromiseRepository } from '../../shared/promise/DefaultSessionPromiseRepository.js';
import { DefaultSessionRepository } from '../../shared/repository/DefaultSessionRepository.js';
import { DefaultSessionUpdateSubscriber } from '../event/DefaultSessionUpdateSubscriber.js';
import { DefaultSessionExecutor } from '../executor/DefaultSessionExecutor.js';

export class DjsSessionPlugin extends BaseSessionPlugin<DjsInteractionTypes> {
  public static create(
    options?: SessionPluginCreateOptions<DjsInteractionTypes>,
  ): DjsSessionPlugin {
    const constructorOptions = options?.injections ?? {};
    const metaFactory = new DefaultMetadataFactory();

    ensureKey(constructorOptions, 'executor', DefaultSessionExecutor.create());
    ensureKey(
      constructorOptions,
      'repository',
      DefaultSessionRepository.create<DjsInteractionTypes>(),
    );
    ensureKey(
      constructorOptions,
      'promiseRepository',
      DefaultSessionPromiseRepository.create<DjsInteractionTypes>(),
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
      BasicEventBus.createAsync<SessionEventArgs<DjsInteractionTypes>>(
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
    interaction: SessionUpdateInteraction<DjsInteractionTypes>,
  ): string {
    return interaction.customId;
  }

  protected override getInteractionMeta(
    interaction: AnySessionInteraction<DjsInteractionTypes>,
  ): SessionInteractionMeta {
    return { id: interaction.id, type: interaction.type };
  }
}
