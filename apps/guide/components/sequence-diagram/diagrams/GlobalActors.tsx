import { Actor } from '../src/actor/Actor';

export const GlobalActors = {
  Client: {
    label: (
      <p>
        Discord.js{' '}
        <a href="https://discord.js.org/docs/packages/discord.js/stable/Client:Class">
          <code>Client</code>
        </a>
      </p>
    ),
    color: '#3f37c9',
    id: 'client',
  },
} as const satisfies Record<string, Actor<string>>;
