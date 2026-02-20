/**
 * Simple 32-bit hashing function (similar to xmur3)
 * Converts a string into a 32-bit unsigned integer seed.
 */
export const stringToHash = (str: string): number => {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3452272251)
    h = (h << 13) | (h >>> 19)
  }
  return (h ^ (h >>> 16)) >>> 0
}

/**
 * Seedable PRNG using the Mulberry32 algorithm.
 * Returns a function that produces pseudo-random floats between 0 and 1.
 */
export const createPRNG = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive) using the provided PRNG.
 */
export const randomInt = (
  prng: () => number,
  min: number,
  max: number
): number => {
  return Math.floor(prng() * (max - min) + min)
}

/**
 * Picks a random item from an array using the provided PRNG.
 */
export const pickItem = <T>(
  prng: () => number,
  items: T[] | readonly T[]
): T => {
  return items[randomInt(prng, 0, items.length)]
}
