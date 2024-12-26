import React from 'react';
import type { Actor } from '../src/actor/Actor';
import { SequenceDiagram } from '../src/SequenceDiagram';
import type { Workflow } from '../src/workflow/Workflow';

type Actors =
  | 'client'
  | 'clientBus'
  | 'subscriber'
  | 'manager'
  | 'repo'
  | 'resolver'
  | 'executor'
  | 'cmdBus'
  | 'middleware'
  | 'errorHandler';

export default function CommandOverviewDiagram() {
  const actors: Actor<Actors>[] = [
    {
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
    {
      label: (
        <p>
          {'🚌 '}
          <a href="../events/event-overview#-subscribing-to-the-client">
            Client <code>EventBus</code>
          </a>
        </p>
      ),
      color: '#F78C6B',
      id: 'clientBus',
    },
    {
      label: (
        <p>
          {'👂 '}
          <a href="./command-subscribers">
            <code>CommandInteractionSubscriber</code>
          </a>
        </p>
      ),
      color: '#0f83a9',
      id: 'subscriber',
    },
    {
      label: (
        <p>
          {'💼 '}
          <a href="./command-manager">
            <code>CommandManager</code>
          </a>
        </p>
      ),
      color: '#EF476F',
      id: 'manager',
    },
    {
      label: (
        <p>
          {'📔 '}
          <a href="./command-repository">
            <code>CommandRepository</code>
          </a>
        </p>
      ),
      color: {
        dark: '#06D6A0',
        light: '#038866',
      },
      id: 'repo',
    },
    {
      label: (
        <p>
          {'🔀 '}
          <a href="./command-resolver">
            <code>CommandResolver</code>
          </a>
        </p>
      ),
      color: '#0CB0A9',
      id: 'resolver',
    },
    {
      label: (
        <p>
          {'⚡ '}
          <a href="./command-executor">
            <code>CommandExecutor</code>
          </a>
        </p>
      ),
      color: { dark: '#FFD166', light: '#ffba1a' },
      id: 'executor',
    },
    {
      label: (
        <p>
          {'️🛡️  '}
          <a href="./command-interception#-command-middlewares">
            <code>MiddlewareList</code>
          </a>
        </p>
      ),
      color: '#6a994e',
      id: 'middleware',
    },
    {
      label: (
        <p>
          {'💫 '}
          <a href="../error/error-handling">
            <code>ErrorHandler</code>
          </a>
        </p>
      ),
      color: '#92162D',
      id: 'errorHandler',
    },
  ];

  const events: Workflow<Actors> = [
    {
      from: 'client',
      steps: [
        {
          to: 'clientBus',
          label: <code>interactionCreate</code>,
          animated: true,
        },
        {
          to: 'subscriber',
          label: 'Call subscribers',
          animated: true,
        },
        {
          to: 'manager',
          label: 'Pass interaction',
        },
      ],
    },
    {
      from: 'manager',
      to: 'repo',
      label: 'Get all commands',
    },
    {
      from: 'manager',
      to: 'resolver',
      label: 'Search executable command',
    },
    {
      from: 'manager',
      to: 'executor',
      label: 'Pass found command to begin execution',
    },
    {
      from: 'executor',
      to: 'middleware',
      label: 'Check middleware list',
      tooltip: 'If there are middlewares registered',
    },
    {
      from: 'middleware',
      to: 'middleware',
      label: 'Check all registered middlewares',
    },
    {
      from: 'middleware',
      to: 'executor',
      label: 'Return allowed or denied',
      tooltip: 'Workflow ends if denied',
    },
    {
      from: 'executor',
      to: 'executor',
      label: 'Execute command',
      animated: true,
    },
    {
      from: 'executor',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      tooltip: 'Workflow ends if it errored',
      animated: true,
    },
    {
      from: 'executor',
      to: 'manager',
      label: 'Finish execution',
      tooltip: (
        <p>
          Emits <code>CommandEventEnum.CommandRun</code>
        </p>
      ),
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    id: 'command-overview',
    height: '45vh',
    defaultViewport: { x: -50, y: 0, zoom: 0.32 },
  });
}
