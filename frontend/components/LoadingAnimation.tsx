import type React from "react"
import { motion } from "framer-motion"

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-25 h-64">
      <motion.div
        className="w-16 h-16 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 20px rgba(59, 130, 246, 0)",
            "0 0 0 0 rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default LoadingAnimation

