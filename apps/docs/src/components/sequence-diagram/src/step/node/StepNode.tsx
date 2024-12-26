import { Handle, Position } from '@xyflow/react';
import type { FC } from 'react';
import React, { memo } from 'react';

type Props = {
  data: { label: React.ReactNode; width?: number; tooltip?: string };
};

export const StepNode: FC<Props> = memo(
  ({ data: { label, width, tooltip } }) => {
    return (
      <div className="step-node">
        {tooltip && (
          <div className="step-node__tooltip">
            <svg
              className="step-node__tooltip-icon"
              viewBox="0 0 16 16"
              preserveAspectRatio="X200Y200 meet"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
            </svg>
            <span className="step-node__tooltip-label">{tooltip}</span>
          </div>
        )}
        <Handle type="source" position={Position.Left} id="s-left" />
        <Handle type="source" position={Position.Right} id="s-right" />
        <Handle type="source" position={Position.Top} id="s-top" />
        <Handle type="source" position={Position.Bottom} id="s-bottom" />

        <div
          className="step-node__label"
          style={{
            width: width ?? 200,
          }}
        >
          {label}
        </div>
        <Handle type="target" position={Position.Left} id="t-left" />
        <Handle type="target" position={Position.Right} id="t-right" />
        <Handle type="target" position={Position.Top} id="t-top" />
        <Handle type="target" position={Position.Bottom} id="t-bottom" />
      </div>
    );
  },
);

export const stepNodeId = 'stepNode';
