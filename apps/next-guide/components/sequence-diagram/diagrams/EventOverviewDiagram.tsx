import type { Node } from '@xyflow/react';
import React from 'react';
import type { Actor } from '../src/actor/Actor';
import { SequenceDiagram } from '../src/SequenceDiagram';
import type { Workflow } from '../src/workflow/Workflow';

type Actors =
  | 'object'
  | 'bus'
  | 'dispatcher'
  | 'middlewareList'
  | 'subscriber'
  | 'errorHandler';

export default function EventOverviewDiagram() {
  const actors: Actor<Actors>[] = [
    {
      label: '👤 Object',
      color: '#ff595e',
      id: 'object',
    },
    {
      label: (
        <p>
          {'🚌 '}
          <a href="./event-bus">
            <code>EventBus</code>
          </a>
        </p>
      ),
      color: '#ff924c',
      id: 'bus',
    },
    {
      label: (
        <p>
          {'⚡ '}
          <a href="./event-dispatcher">
            <code>EventDispatcher</code>
          </a>
        </p>
      ),
      color: '#ffca3a',
      id: 'dispatcher',
    },
    {
      label: (
        <p>
          {'️🛡️  '}
          <a href="./event-interception#-event-middlewares">
            <code>MiddlewareList</code>
          </a>
        </p>
      ),
      color: '#8ac926',
      id: 'middlewareList',
    },
    {
      label: (
        <p>
          {'👂 '}
          <a href="./event-subscriber">
            <code>EventSubscriber</code>
          </a>
        </p>
      ),
      color: {
        dark: '#1982c4',
        light: '#038866',
      },
      id: 'subscriber',
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
      from: 'object',
      to: 'bus',
      label: 'Emit event',
      animated: true,
    },
    {
      from: 'bus',
      to: 'bus',
      label: 'Get subscribers for event',
    },
    {
      from: 'bus',
      steps: [
        {
          to: 'dispatcher',
          label: 'Pass subscribers and args',
        },
        {
          to: 'middlewareList',
          label: 'Check middleware list',
          tooltip: 'Only if there are middlewares registered',
        },
      ],
    },
    {
      from: 'middlewareList',
      to: 'middlewareList',
      label: 'Check all registered middlewares',
    },
    {
      from: 'middlewareList',
      to: 'dispatcher',
      label: 'Return allowed or denied',
      tooltip: 'Workflow ends if denied',
    },
    {
      from: 'dispatcher',
      to: 'subscriber',
      label: 'Notify subscriber',
    },
    {
      from: 'dispatcher',
      to: 'errorHandler',
      label: 'Pass thrown errors, if any',
      tooltip: 'Workflow ends if it errored',
      animated: true,
    },
    {
      from: 'dispatcher',
      to: 'bus',
      label: 'Finish execution',
    },
  ];

  // I didn't see much use in making an entire group system
  // for this one diagram so I just did this ¯\_(ツ)_/¯
  const beforeNodes: Node[] = [
    {
      type: 'group',
      id: 'group',
      position: { x: 790, y: 440 },
      data: {},
      style: {
        cursor: 'grab',
        width: 980,
        height: 670,
      },
    },
  ];
  const afterNodes: Node[] = [
    {
      id: 'group-label',
      position: { x: 1490, y: 440 },
      data: { label: 'For each subscriber' },
      style: {
        fontSize: 27,
        width: 'auto',
        border: 'none',
        textShadow: 'var(--ifm-color-emphasis-100) 1px 0 10px',
        fontFamily: 'Segoe TV, sans-serif',
        backgroundColor: 'transparent',
        cursor: 'grab',
      },
    },
  ];

  return SequenceDiagram({
    actors,
    events,
    id: 'event-overview',
    height: '65vh',
    beforeNodes,
    afterNodes,
    defaultViewport: { x: -100, y: -20, zoom: 0.53 },
  });
}
