import { useState, useEffect } from "react"

export function useTypingEffect(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    setDisplayed("")
    let i = 0

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++

      if (i > text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return displayed
}
