import { chanceOf, sum } from "../utils"

import { useMemo, useState } from "react"

type Memory = number[]
enum Outcome {
  Break = 1,
  Work,
}

export function WorkRng() {
  // Hooks
  const [isRevealed, setIsRevealed] = useState(false)

  const memory = useMemo(() => {
    // Get our memory of the previous days' outcomes
    const memoryStore = localStorage.getItem("memory")

    if (memoryStore) {
      const memory: Memory = JSON.parse(memoryStore)["data"]

      return memory
    }

    return []
  }, [])

  const breakCount = useMemo(() => {
    let count = 0

    // Count the breaks in the previous week (excludes the first day)
    for (const item of memory.slice(1)) {
      if (item === Outcome.Break) {
        count++
      }
    }

    return count
  }, [memory])

  // Functions
  const getTimestamp = () => {
    const date = new Date()

    const month = date.getUTCMonth()
    const day = date.getDate()
    const year = date.getUTCFullYear()

    return `${month}/${day}/${year}`
  }

  const updateMemory = (add: number) => {
    memory.push(add)

    while (memory.length > 5) {
      memory.shift()
    }

    localStorage.setItem("memory", JSON.stringify({ data: memory }))

    // Remember that we've randomized today
    localStorage.setItem("lastPull", getTimestamp())

    return add
  }

  const didToday = () => {
    // Tell if we've already pulled today
    const lastPull = localStorage.getItem("lastPull")

    return lastPull === getTimestamp()
  }

  const canBreak = () => {
    // Figure out if we can break

    // We can't break if we had one yesterday
    if (memory[memory.length - 1] === Outcome.Break) {
      return false
    }

    // We can't break if we've already had 2 this week
    if (breakCount >= 2) {
      return false
    }

    return true
  }

  const getOutcome = () => {
    if (!didToday()) {
      // Force a break if we've worked 3 days in a row
      if (sum(memory.slice(-3)) === Outcome.Work * 3 && canBreak()) {
        return updateMemory(Outcome.Break)
      }

      // Break with a chance of 2 out of 7
      if (chanceOf(2, 7) && canBreak()) {
        return updateMemory(Outcome.Break)
      } else {
        return updateMemory(Outcome.Work)
      }
    } else {
      // Don't do anything if we've already randomized today
      return memory[memory.length - 1]
    }
  }

  return (
    <>
      {!isRevealed ? (
        <button onClick={() => setIsRevealed(true)}>Reveal</button>
      ) : getOutcome() === Outcome.Work ? (
        "work"
      ) : (
        "break"
      )}
    </>
  )
}
