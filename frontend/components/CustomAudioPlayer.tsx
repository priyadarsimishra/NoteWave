import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AudioPlayer from "react-h5-audio-player"
import "react-h5-audio-player/lib/styles.css"

interface AudioPlayerProps {
  audioUrl: string
  onTimeUpdate: (currentTime: number) => void
}

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    // This effect is used to sync the isPlaying state with the actual audio player state
    const audioElement = document.querySelector("audio")
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)

      audioElement.addEventListener("play", handlePlay)
      audioElement.addEventListener("pause", handlePause)

      return () => {
        audioElement.removeEventListener("play", handlePlay)
        audioElement.removeEventListener("pause", handlePause)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center mt-5 mb-4 space-x-8">
        <motion.div
          className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center"
          animate={{
            scale: isPlaying ? [1, 1.1, 1] : 1,
            boxShadow: isPlaying
              ? ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 20px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"]
              : "0 0 0 0 rgba(59, 130, 246, 0)",
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-16 h-16 bg-white rounded-full"
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        <motion.div
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
          animate={{
            scale: isPlaying ? [1, 1.1, 1] : 1,
            boxShadow: isPlaying
              ? ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 20px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
              : "0 0 0 0 rgba(34, 197, 94, 0)",
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-16 h-16 bg-white rounded-full"
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
      <AudioPlayer
        src={audioUrl}
        // onListen={onTimeUpdate}
        // onPlay={() => setIsPlaying(true)}
        // onPause={() => setIsPlaying(false)}
        // showJumpControls={true}
        // customControlsSection={["play", "volume"]}
        // customProgressBarSection={["progress", "current-time", "duration"]}
        className="rhap_container"
      />
    </div>
  )
}

export default CustomAudioPlayer

