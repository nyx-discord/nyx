import React from 'react';
import type { Actor } from '../../src/actor/Actor';
import { SequenceDiagram } from '../../src/SequenceDiagram';
import type { Workflow } from '../../src/workflow/Workflow';

type Actors =
  | 'user'
  | 'command'
  | 'session'
  | 'manager'
  | 'repository'
  | 'executor'
  | 'middleware'
  | 'errorHandler';

export default function SessionStartDiagram() {
  const actors: Actor<Actors>[] = [
    { id: 'user', label: '🧑 User', color: '#ff595e' },
    { id: 'command', label: '💻 Command', color: '#ff924c' },
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
          to: 'command',
          label: 'Execute command',
          tooltip:
            "A session can technically start from any interaction (eg. buttons), but it's more common to start from a command call.",
        },
        {
          to: 'session',
          label: <code>new Session(params)</code>,
          offset: -2.5,
        },
      ],
    },
    {
      from: 'command',
      to: 'manager',
      label: (
        <p>
          <code>SessionManager#start(session)</code> or{' '}
          <code>Session#start()</code>
        </p>
      ),
    },
    {
      from: 'manager',
      to: 'repository',
      // needs a space, too long to fit in one line
      label: <code>SessionRepository #save(session)</code>,
      offset: -2.5,
    },
    {
      from: 'manager',
      steps: [
        {
          to: 'executor',
          label: <code>SessionExecutor#start(session, metadata)</code>,
          tooltip: (
            <p>
              The <code>metadata</code> is either user-provided or inferred from
              the interaction.
            </p>
          ),
        },
        {
          to: 'middleware',
          label: <code>MiddlewareList #check(session, metadata)</code>,
          offset: -15,
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
          label: <code>Session#onStart(metadata)</code>,
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
      from: 'executor',
      to: 'manager',
      label: 'Finish execution',
      tooltip: (
        <p>
          Emits <code>SessionEventEnum.SessionStart</code>
        </p>
      ),
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    height: '43vh',
    defaultViewport: { x: -80, y: -10, zoom: 0.412 },
    id: 'session-start',
  });
}
