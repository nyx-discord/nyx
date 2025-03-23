import type { Node } from '@xyflow/react';
import type { Actor } from '../actor/Actor';
import { actorNodeId } from '../actor/node/ActorNode';
import {
  getActorLabelId,
  getActorLineId,
  getLabelId,
  getLineId,
} from '../identifier/idFactories';
import {
  getActorX,
  getLabelWidth,
  getLabelX,
  getLabelY,
  getLineY,
  getNextLabelExtraPadding,
  getTotalHeight,
  labelHeight,
  top,
} from '../layout/layoutCalculations';
import { stepNodeId } from '../step/node/StepNode';
import type { Workflow } from '../workflow/Workflow';

type PositionedActor<ActorIds extends string> = Actor<ActorIds> & {
  x: number;
};

export function createNodes<ActorIds extends string>(
  actors: Actor<ActorIds>[],
  workflow: Workflow<ActorIds>,
): Node[] {
  const nodes: Node[] = [];
  const actorsRecord: Record<
    ActorIds,
    PositionedActor<ActorIds>
  > = Object.create(null);

  let extraPadding = 0;
  let lastX = 0;
  for (const actor of actors) {
    const x = getActorX(lastX) + extraPadding;
    actorsRecord[actor.id] = { ...actor, x };

    lastX = x;
    extraPadding = getNextLabelExtraPadding(actor.label);
  }

  // actual workflow
  let row = 1;
  for (const [sequenceIndex, sequence] of workflow.entries()) {
    const fromActor = actorsRecord[sequence.from];
    if (!fromActor) {
      throw new Error(
        `A sequence starts from: ${
          sequence.from
        }, but no such actor exists. Sequence: ${stringify(sequence)}`,
      );
    }

    const steps = 'steps' in sequence ? sequence.steps : [sequence];
    const selfStep = steps.find((step) => step.to === sequence.from);

    if (selfStep) {
      if (steps.length > 1) {
        throw new Error(
          'A sequence with a self-referencing step cannot have more than one step.',
        );
      }

      row++;
      // add label on next row
      const nextRowLabelId = getLabelId(row, fromActor.id, fromActor.id);
      const nextRowLabel = {
        id: nextRowLabelId,
        position: {
          x: getLabelX(fromActor.x),
          y: getLabelY(getLineY(row)) + (selfStep.offset ?? 0),
        },
        data: { label: selfStep.label, tooltip: selfStep.tooltip },
        type: stepNodeId,
      };
      nodes.push(nextRowLabel);

      // if the previous step was also a self reference, don't add line and skip to next row
      const before = workflow[sequenceIndex - 1];
      if (before) {
        const nextStep =
          'steps' in before
            ? { ...before.steps[0], from: before.from }
            : before;

        if (nextStep.from === sequence.from && nextStep.to === sequence.from) {
          continue;
        }
      }

      // this case is for the first step of a self reference sequence, add line
      const lineNode: Node = {
        id: getLineId(row - 1, fromActor.id),
        position: {
          x: fromActor.x - 1,
          y: getLineY(row - 1),
        },
        data: { color: fromActor.color },
        type: actorNodeId,
      };
      nodes.push(lineNode);

      continue;
    }

    // in case the one before was a self reference but this isn't (end of a self reference sequence), skip one row
    const sequenceBefore = workflow[sequenceIndex - 1];
    if (sequenceBefore) {
      const beforeFirstStep =
        'steps' in sequenceBefore
          ? { ...sequenceBefore.steps[0], from: sequenceBefore.from }
          : sequenceBefore;

      if (
        beforeFirstStep.from === sequence.from
        && beforeFirstStep.to === sequence.from
      ) {
        row++;
        nodes.push({
          id: getLineId(row, fromActor.id),
          position: { x: fromActor.x - 1, y: getLineY(row) },
          data: { color: fromActor.color },
          type: actorNodeId,
        });
        row++;
      }
    }

    nodes.push({
      id: getLineId(row, fromActor.id),
      position: { x: fromActor.x - 1, y: getLineY(row) },
      data: { color: fromActor.color },
      type: actorNodeId,
    });

    let lastActor = fromActor;

    for (const step of steps) {
      const toActor = actorsRecord[step.to];
      if (!toActor) {
        throw new Error(
          `A sequence leads to: ${
            step.to
          }, but no such actor exists. Step: ${stringify(step)}`,
        );
      }

      const position = Math.min(toActor.x, lastActor.x);

      nodes.push({
        id: getLabelId(row, lastActor.id, toActor.id),
        position: {
          x: getLabelX(position),
          y: getLabelY(getLineY(row)) + (step.offset ?? 0),
        },
        data: {
          label: step.label,
          width: getLabelWidth(lastActor.x, toActor.x),
          tooltip: step.tooltip,
        },
        type: stepNodeId,
      });

      nodes.push({
        id: getLineId(row, toActor.id),
        position: { x: toActor.x - 1, y: getLineY(row) },
        data: { color: toActor.color },
        type: actorNodeId,
      });

      lastActor = toActor;
    }

    row++;
  }

  const totalHeight = getTotalHeight(row - 1);

  // actor labels
  for (const actor of actors) {
    const actorPosition = actorsRecord[actor.id].x;

    const mainLineNode: Node = {
      id: getActorLineId(actor.id),
      position: { x: actorPosition, y: top },
      data: { height: totalHeight, width: 2 },
      type: actorNodeId,
    };

    const labelNode: Node = {
      id: getActorLabelId(actor.id),
      position: { x: actorPosition - 2, y: top },
      data: {
        color: actor.color,
        label: actor.label,
        width: 6,
        height: labelHeight,
      },
      type: actorNodeId,
    };

    nodes.unshift(mainLineNode, labelNode);
  }

  return nodes;
}

function stringify(obj: object) {
  const seen = [];
  return JSON.stringify(obj, function (key, val) {
    if (val != null && typeof val == 'object') {
      if (seen.indexOf(val) >= 0) {
        return;
      }
      seen.push(val);
    }
    return val;
  });
}
