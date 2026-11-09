import React from 'react';
import type { Actor } from '../../src/actor/Actor';
import { SequenceDiagram } from '../../src/SequenceDiagram';
import type { Workflow } from '../../src/workflow/Workflow';

type Actors = 'repository' | 'manager' | 'executor' | 'session' | 'promise';

export default function SessionUpdateDiagram() {
  const actors: Actor<Actors>[] = [
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
          {'⌛ '}
          <a href="./session-promise-repository">
            <code>Session Promise Repository</code>
          </a>
        </p>
      ),
      color: '#92162D',
      id: 'promise',
    },
  ];

  const events: Workflow<Actors> = [
    {
      from: 'repository',
      to: 'repository',
      label: 'Remove expired session',
    },
    {
      from: 'repository',
      to: 'manager',
      label: 'Notify session expiration',
    },
    {
      from: 'manager',
      steps: [
        {
          to: 'executor',
          label: <code>SessionExecutor#end (session, ...data)</code>,
          offset: -2.5,
        },
        {
          to: 'session',
          label: <code>Session#onEnd (...data)</code>,
          offset: -2.5,
        },
      ],
    },
    {
      from: 'executor',
      to: 'session',
      label: <code>Session#getResult()</code>,
    },
    {
      from: 'executor',
      to: 'manager',
      label: (
        <p>
          Return wrapped in <code>SessionEndData</code>
        </p>
      ),
    },
    {
      from: 'manager',
      to: 'promise',
      label: <code>SessionPromiseRepository#resolve(session, endData)</code>,
    },
    {
      from: 'promise',
      to: 'manager',
      label: 'Finish execution',
      tooltip: (
        <p>
          Emits <code>SessionEventEnum.SessionExpire</code>
        </p>
      ),
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    height: '50vh',
    id: 'session-expiration',
  });
}
