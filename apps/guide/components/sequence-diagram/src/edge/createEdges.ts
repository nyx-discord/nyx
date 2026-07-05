import type { Edge } from '@xyflow/react';
import { ConnectionLineType, MarkerType } from '@xyflow/react';
import type { Actor } from '../actor/Actor';
import { getLabelId, getLineId } from '../identifier/idFactories';
import type { Workflow } from '../workflow/Workflow';

type EdgeOptions = {
  from: string;
  to: string;
  fromHandle: 'left' | 'right' | 'top' | 'bottom';
  toHandle: 'left' | 'right' | 'top' | 'bottom';
  animated?: boolean;
};

function createEdge({
  from,
  to,
  fromHandle,
  toHandle,
  animated,
}: EdgeOptions): Edge {
  return {
    id: `${from}-${to}`,
    source: from,
    sourceHandle: `s-${fromHandle}`,
    target: to,
    targetHandle: `t-${toHandle}`,
    markerEnd: { type: MarkerType.ArrowClosed },
    type: ConnectionLineType.SmoothStep,
    animated,
  };
}

export function createEdges<ActorIds extends string>(
  actors: Actor<ActorIds>[],
  workflow: Workflow<ActorIds>,
): Edge[] {
  const edges: Edge[] = [];

  let row = 1;
  for (const [sequenceIndex, sequence] of workflow.entries()) {
    const steps = 'steps' in sequence ? sequence.steps : [sequence];
    if (steps.length === 0) {
      throw new Error(`No steps in sequence: ${JSON.stringify(sequence)}`);
    }

    let lastFrom = sequence.from;
    for (const [stepIndex, step] of steps.entries()) {
      // If it's a self reference step
      if (sequence.from === step.to) {
        // if the step before was also a self reference, join labels
        const before = workflow[sequenceIndex - 1];
        if (before) {
          const nextStep =
            'steps' in before
              ? { ...before.steps[0], from: before.from }
              : before;

          if (nextStep.from === nextStep.to && nextStep.to === sequence.from) {
            const beforeLabelId = getLabelId(row - 1, step.to, step.to);
            const labelId = getLabelId(row, step.to, step.to);
            const edge = createEdge({
              from: beforeLabelId,
              to: labelId,
              fromHandle: 'bottom',
              toHandle: 'top',
              animated: step.animated,
            });
            edges.push(edge);

            continue;
          }
        }

        const fromLineId = getLineId(row, lastFrom);
        const labelId = getLabelId(row + 1, lastFrom, step.to);
        const topEdge = createEdge({
          from: fromLineId,
          to: labelId,
          fromHandle: 'right',
          toHandle: 'top',
          animated: step.animated,
        });
        edges.push(topEdge);

        row++;

        continue;
      } else {
        // if it isn't a self reference, but the step before was, join label with end line
        const before = workflow[sequenceIndex - 1];
        if (before && stepIndex === 0) {
          const beforeStep =
            'steps' in before
              ? { ...before.steps[0], from: before.from }
              : before;

          if (beforeStep.from === beforeStep.to) {
            const beforeLabelId = getLabelId(
              row - 1,
              beforeStep.to,
              beforeStep.to,
            );
            const lineId = getLineId(row, beforeStep.to);
            const edge = createEdge({
              from: beforeLabelId,
              to: lineId,
              fromHandle: 'bottom',
              toHandle: 'right',
              animated: beforeStep.animated,
            });
            row++;
            edges.push(edge);
          }
        }
      }

      const fromLineId = getLineId(row, lastFrom);
      const toLineId = getLineId(row, step.to);

      const labelId = getLabelId(row, lastFrom, step.to);

      const fromIndex = actors.findIndex((actor) => actor.id === lastFrom);
      const toIndex = actors.findIndex((actor) => actor.id === step.to);

      const isForward = toIndex > fromIndex;

      const toLabelEdge = createEdge({
        from: fromLineId,
        to: labelId,
        fromHandle: isForward ? 'right' : 'left',
        toHandle: isForward ? 'left' : 'right',
        animated: step.animated,
      });

      const fromLabelEdge = createEdge({
        from: labelId,
        to: toLineId,
        fromHandle: isForward ? 'right' : 'left',
        toHandle: isForward ? 'left' : 'right',
        animated: step.animated,
      });

      edges.push(toLabelEdge, fromLabelEdge);

      lastFrom = step.to;
    }

    row++;
  }

  return edges;
}
