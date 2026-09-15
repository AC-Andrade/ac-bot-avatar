export const createPatternId = (
  pattern: string,
  input: string,
  idPrefix?: string
): string => {
  if (idPrefix) return `${idPrefix}-${pattern}`;

  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `ac-bot-pattern-${pattern}-${(hash >>> 0).toString(36)}`;
};
