import { useColorMode } from '@docusaurus/theme-common';
import type { Node, Viewport } from '@xyflow/react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow as ReactFlowComponent,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useMemo } from 'react';
import type { Actor } from './actor/Actor';
import { ActorNode, actorNodeId } from './actor/node/ActorNode';
import { createEdges } from './edge/createEdges';
import { createNodes } from './node/createNodes';
import { StepNode, stepNodeId } from './step/node/StepNode';
import type { Workflow } from './workflow/Workflow';

type Props<ActorIds extends string> = {
  actors: Actor<ActorIds>[];
  events: Workflow<ActorIds>;
  id: string;
  beforeNodes?: Node[];
  afterNodes?: Node[];
  height?: string;
  defaultViewport?: Viewport;
};

// you're free to copy all of this, but I'm no frontend developer. I'm pretty sure
// I've broken the geneva conventions of web development, so don't expect
// it to work 100% of the time, or for it to have good web design practices.
// the required code is everything under this src folder, and the CSS is under src/css/custom.css, in the react-flow section.
export const SequenceDiagram = <ActorIds extends string>(
  props: Props<ActorIds>,
) => {
  const nodes = createNodes(props.actors, props.events);
  const edges = createEdges(props.actors, props.events);

  if (props.beforeNodes) {
    nodes.unshift(...props.beforeNodes);
  }
  if (props.afterNodes) {
    nodes.push(...props.afterNodes);
  }

  const { colorMode } = useColorMode();

  const nodeTypes = useMemo(
    () => ({
      [stepNodeId]: StepNode,
      [actorNodeId]: ActorNode,
    }),
    [nodes, edges],
  );

  return (
    <div style={{ height: props.height ?? '60vh' }}>
      <ReactFlowComponent
        id={props.id}
        className="sequence-diagram"
        nodes={nodes}
        edges={edges}
        colorMode={colorMode}
        edgesReconnectable={false}
        elementsSelectable={false}
        nodesDraggable={false}
        onNodeMouseEnter={(_event, node) => (node.data.isHovering = true)}
        onNodeMouseLeave={(_event, node) => (node.data.isHovering = false)}
        nodeTypes={nodeTypes}
        minZoom={0}
        fitView={props.defaultViewport === undefined}
        defaultViewport={props.defaultViewport}
      >
        <Background
          id={props.id}
          className="sequence-diagram__background"
          variant={BackgroundVariant.Dots}
          size={1}
          bgColor={colorMode === 'dark' ? '#212121' : '#f6f8fa'}
        />
        <Controls
          className="sequence-diagram__controls"
          fitViewOptions={{ duration: 200 }}
          showInteractive={false}
        />
      </ReactFlowComponent>
    </div>
  );
};
