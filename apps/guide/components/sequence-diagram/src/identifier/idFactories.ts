export function getActorLineId(actorId: string) {
  return `actorLine-${actorId}`;
}

export function getActorLabelId(actorId: string) {
  return `label-${actorId}`;
}

export function getLineId(lineNumber: number, fromActorId: string) {
  return `line-${lineNumber}-${fromActorId}`;
}

export function getLabelId(
  sequenceNumber: number,
  fromActorId: string,
  toActorId: string,
) {
  return `label-${sequenceNumber}-${fromActorId}-${toActorId}`;
}
