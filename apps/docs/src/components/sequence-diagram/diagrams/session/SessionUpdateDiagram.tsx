import React from 'react';
import type { Actor } from '../../src/actor/Actor';
import { SequenceDiagram } from '../../src/SequenceDiagram';
import type { Workflow } from '../../src/workflow/Workflow';

type Actors =
  | 'user'
  | 'subscriber'
  | 'manager'
  | 'codec'
  | 'session'
  | 'repository'
  | 'executor'
  | 'middleware'
  | 'errorHandler';

export default function SessionUpdateDiagram() {
  const actors: Actor<Actors>[] = [
    { id: 'user', label: '🧑 User', color: '#ff595e' },
    { id: 'subscriber', label: '👂 Subscriber', color: '#ff924c' },
    {
      label: (
        <p>
          {'💼 '}
          <a href="./session-manager">
            <code>SessionManager</code>
          </a>
        </p>
      ),
      color: '#EF476F',
      id: 'manager',
    },
    {
      label: (
        <p>
          {'💬 '}
          <a href="./session-customid-codec">
            <code>SessionCustomIdCodec</code>
          </a>
        </p>
      ),
      color: '#EF476F',
      id: 'codec',
    },
    {
      id: 'session',
      label: (
        <p>
          {'👤 '}
          <code>Session</code>
        </p>
      ),
      color: '#ffca3a',
    },
    {
      label: (
        <p>
          {'🚌 '}
          <a href="./session-repository">
            <code>SessionRepository</code>
          </a>
        </p>
      ),
      color: '#F78C6B',
      id: 'repository',
    },
    {
      label: (
        <p>
          {'⚡ '}
          <a href="./session-executor">
            <code>SessionExecutor</code>
          </a>
        </p>
      ),
      color: '#FFD166',
      id: 'executor',
    },
    {
      label: (
        <p>
          {'👀 '}
          <a href="./session-middleware">
            <code>SessionMiddleware</code>
          </a>
        </p>
      ),
      color: '#FFD166',
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
      from: 'user',
      steps: [
        {
          to: 'subscriber',
          label: (
            <p>
              Triggers <code>interactionCreate</code>
            </p>
          ),
          tooltip: (
            <p>
              Through a component (eg. a button) whose <code>customId</code>{' '}
              refers a <code>Session</code>
            </p>
          ),
          offset: -1.5,
        },
        {
          to: 'manager',
          label: <p>Pass interaction</p>,
        },
        {
          to: 'codec',
          label: (
            <p>
              Extract session ID from <code>customId</code>
            </p>
          ),
          offset: -1.5,
          tooltip: <code>CustomIdCodec#deserializeToObjectId(customId)</code>,
        },
        {
          to: 'repository',
          label: 'Get session by extracted ID',
          tooltip: 'Workflow ends if session is not found.',
        },
      ],
    },
    {
      from: 'manager',
      steps: [
        {
          to: 'executor',
          label: (
            <ul>
              <li>
                Session found:{' '}
                <code>
                  SessionExecutor#update(session, interaction, metadata)
                </code>
              </li>
              <li>
                Session not found, but ID was:{' '}
                <code>SessionExecutor#handleMissing(id, interaction)</code>
              </li>
              <li>Otherwise end workflow</li>
            </ul>
          ),
        },
        {
          to: 'middleware',
          label: (
            <code>MiddlewareList #check(session, interaction, metadata)</code>
          ),
          offset: -28,
        },
      ],
    },

    {
      from: 'middleware',
      to: 'middleware',
      label: (
        <p>
          Iterate middlewares' <code>Middleware#check (session, metadata)</code>
        </p>
      ),
      tooltip: 'If there are registered middlewares',
      offset: -10,
    },
    {
      from: 'middleware',
      steps: [
        {
          to: 'executor',
          label: 'Return allowed or denied',
          tooltip: 'Workflow ends if denied',
          offset: -1,
        },
        {
          to: 'session',
          label: <code>Session#onUpdate(interaction, metadata)</code>,
        },
      ],
    },
    {
      from: 'executor',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      animated: true,
    },
    {
      from: 'session',
      to: 'executor',
      label: 'Return whether TTL should be updated',
    },
    {
      from: 'executor',
      to: 'manager',
      label: 'Pass TTL update decision',
    },
    {
      from: 'manager',
      to: 'repository',
      label: 'Update TTL if requested',
      tooltip: (
        <p>
          Regardless of TTL update, emits{' '}
          <code>SessionEventEnum.SessionUpdate</code>
        </p>
      ),
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    height: '40vh',
    defaultViewport: { x: -85, y: 0, zoom: 0.358 },
    id: 'session-update',
  });
}
