/**
 * Get a random integer between two values.
 *
 * @param min The minimum value for the range. Defaults to `0` if max is not
 * defined.
 * @param max The maximum value for the range.
 */
export function randInt(min: number, max: number | undefined = undefined) {
  // Assume the min is 0 if they only give us one value
  if (!max) {
    max = min
    min = 0
  }

  // 1: Get a random number from the range between min and max
  // 2: Round that number to an integer
  // 3: Add the min to it so we stay inside the range
  // 4: Limit to returning the max if we happened to round bigger than it
  return Math.min(Math.floor((max - min) * Math.random()) + min, max)
}

/**
 * Simulate the chance of something occuring in a total amount of trys.
 *
 * @param occurrences The amount of time this should happen.
 * @param total The total amount of trys.
 */
export function chanceOf(occurrences: number, total: number) {
  // Find the rate
  // const rate = (occurrences / total) * 100

  // Normalize the total
  total = total / occurrences

  return randInt(total) === 0
}

/**
 * Get the total of an array.
 *
 * @param array The array to total.
 */
export function sum(array: number[]) {
  let total = 0

  for (const item of array) {
    total += item
  }

  return total
}
