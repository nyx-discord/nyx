import { useColorMode } from '@docusaurus/theme-common';
import { Handle, Position } from '@xyflow/react';
import type { FC } from 'react';
import React, { memo } from 'react';
import {
  actorXGap,
  getNextLabelExtraPadding,
} from '../../layout/layoutCalculations';
import type { Actor } from '../Actor';

type Props = {
  data: Actor<string> & {
    width?: number;
    height?: number;
  };
};

export const ActorNode: FC<Props> = memo(({ data }) => {
  const { label, width, height } = data;
  const { colorMode } = useColorMode();

  const colorData = data.color ?? {};
  const color: `#${string}` =
    typeof colorData === 'string' ? colorData : colorData[colorMode];

  return (
    <div className="actor-node">
      <Handle type="source" position={Position.Left} id="s-left" />
      <Handle type="source" position={Position.Right} id="s-right" />
      <div
        className="actor-node__body"
        style={{
          width: width ?? 4,
          height: height ?? 60,
          backgroundColor:
            color ?? (colorMode === 'dark' ? '#585858' : '#BABABA'),
        }}
      >
        {label && (
          <div
            className="actor-node__label"
            style={{
              width: actorXGap + getNextLabelExtraPadding(label),
            }}
          >
            {label}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="t-left" />
      <Handle type="target" position={Position.Right} id="t-right" />
    </div>
  );
});

export const actorNodeId = 'actorNode';
