import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TranscriptProps {
  transcript: string
  currentTime: number
}



const Transcript: React.FC<TranscriptProps> = ({ transcript, currentTime }) => {
  console.log("Transcript:", transcript)
  const [time, setCurrentTime] = useState(0); // Track current time
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const words = transcript.split(" ")

  // useEffect(() => {
  //   // This is a simplified example. In a real application, you'd need to sync this with actual word timings.
  //   console.log("Current Time:", currentTime) 
  //   const wordIndex = Math.floor(currentTime / 0.5) // Assuming each word takes about 0.5 seconds
  //   setHighlightedIndex(wordIndex)
  //   currentTime += 1
  // }, [currentTime])

  useEffect(() => {
    // This will increase the time by 1 every second
    const intervalId = setInterval(() => {
      setCurrentTime(prevTime => prevTime + 1);
    }, 1000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Calculate the word index based on the currentTime (assuming 0.5 seconds per word)
    const wordIndex = Math.floor(currentTime / 0.5); 
    setHighlightedIndex(wordIndex);
  }, [time]); // Run every time currentTime updates

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-[url(/figs.svg)] rounded-lg h-3/5 border-2 border-black border-solid overflow-y-auto">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block mr-1 ${index === highlightedIndex ? "text-[#0339f8] font-bold" : ""}`}
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

