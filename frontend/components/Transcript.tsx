import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TranscriptProps {
  transcript: string
  currentTime: number
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, currentTime }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const words = transcript.split(" ")

  useEffect(() => {
    // This is a simplified example. In a real application, you'd need to sync this with actual word timings.
    const wordIndex = Math.floor(currentTime / 0.5) // Assuming each word takes about 0.5 seconds
    setHighlightedIndex(wordIndex)
  }, [currentTime])

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg h-64 overflow-y-auto">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block mr-1 ${index === highlightedIndex ? "text-blue-500 font-bold" : ""}`}
          animate={{
            scale: index === highlightedIndex ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

export default Transcript

