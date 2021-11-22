import { chanceOf } from "utils"

import { useState } from "react"

type Outcome = number
type memory = Outcome[]

export function WorkRng() {
  // Hooks
  const [isRevealed, setIsRevealed] = useState(false)

  // Functions
  const getMemory = () => {
    // Get our memory of the previous days' outcomes
    const memoryStore = localStorage.getItem("memory")

    if (memoryStore) {
      const memory: memory = JSON.parse(memoryStore)["data"]

      return memory
    }

    return []
  }

  const didToday = () => {
    // Tell if we've already pulled today
    const lastPull = localStorage.getItem("lastPull")

    const date = new Date()
    const month = date.getUTCMonth()
    const day = date.getUTCDay()
    const year = date.getUTCFullYear()

    return lastPull === `${month}/${day}/${year}`
  }

  const getOutcome = () => {
    const memory = getMemory()

    if (!didToday()) {
      // Break with a chance of 2 out of 7
      if (chanceOf(2, 7)) {
        // Break
        return 0
      } else {
        // Work
        return 1
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
      ) : (
        getOutcome()
      )}
    </>
  )
}
