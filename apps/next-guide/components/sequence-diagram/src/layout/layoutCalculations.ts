export const left = 50;
export const top = 50;

export const actorXGap = 270;
const lineYGap = 90;

export const labelXGap = 50;
export const labelHeight = 50;

export function getLabelX(leftAgent: number) {
  return leftAgent + labelXGap;
}

export function getLabelY(lineY: number) {
  return lineY - 5;
}

export function getLineY(sequenceNumber: number) {
  const firstLine = top + lineYGap - 20;
  return sequenceNumber === 1
    ? firstLine
    : firstLine + lineYGap * (sequenceNumber - 1);
}

export function getActorX(lastX: number) {
  return lastX + actorXGap;
}

export function getTotalHeight(lines: number) {
  return getLineY(lines) + lineYGap - labelHeight;
}

export function getLabelWidth(fromX: number, toX: number) {
  const gap = Math.abs(toX - fromX);
  return gap - labelXGap * 2;
}

export function getTotalComponentHeight(lines: number) {
  return getLineY(lines);
}

export function getNextLabelExtraPadding(label: React.ReactNode) {
  const labelLength = getNodeText(label).length;
  const extra = labelLength - 15;
  return extra > 0 ? 12 * extra : 0;
}

// https://stackoverflow.com/questions/34204975/react-is-there-something-similar-to-node-textcontent/60564620#60564620
function getNodeText(node: React.ReactNode): string {
  if (node === null) return '';

  switch (typeof node) {
    case 'string':
    case 'number':
      return node.toString();

    case 'boolean':
      return '';

    case 'object': {
      if (node instanceof Array) return node.map(getNodeText).join('');
      if ('props' in node) return getNodeText(node.props.children);

      return '';
    } // eslint-ignore-line no-fallthrough

    default:
      console.warn('Unresolved `node` of type:', typeof node, node);
      return '';
  }
}
