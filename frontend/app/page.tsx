"use client"

import React, { useState } from "react"
import Header from "@/components/Header"
import FileUpload from "@/components/FileUpload"
import Modal from "@/components/Modal"
import LoadingAnimation from "@/components/LoadingAnimation"
import CustomAudioPlayer from "@/components/CustomAudioPlayer"
import Transcript from "@/components/Transcript"
import Archive from "@/components/Archive"
import "react-h5-audio-player/lib/styles.css"

interface PodcastData {
  id: string
  audioUrl: string
  transcript: string
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPodcast, setCurrentPodcast] = useState<PodcastData | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [archiveItems, setArchiveItems] = useState<{ id: string; title: string; date: string }[]>([])

  const handleFileSelect = async (file: File) => {
    setIsModalOpen(true)
    setIsLoading(true)

    // Simulating file upload and processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In a real application, you would upload the file to your server here
    // and get back the audio URL and transcript

    const newPodcast: PodcastData = {
      id: Date.now().toString(),
      audioUrl: "/path-to-your-audio-file.mp3", // Replace with actual audio URL
      transcript: "This is a sample transcript. It would be longer in a real application.",
    }

    setCurrentPodcast(newPodcast)
    setIsLoading(false)

    // Add the new podcast to the archive
    setArchiveItems((prevItems) => {
      const newItems = [{ id: newPodcast.id, title: file.name, date: new Date().toLocaleDateString() }, ...prevItems]
      // Ensure we only keep the 6 most recent items
      return newItems.slice(0, 6)
    })
  }

  const handleArchiveItemClick = (id: string) => {
    // In a real application, you would fetch the podcast data from your server here
    const selectedPodcast = {
      id,
      audioUrl: "/path-to-your-audio-file.mp3", // Replace with actual audio URL
      transcript: "This is a sample transcript for an archived podcast.",
    }

    setCurrentPodcast(selectedPodcast)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Create New Podcast</h2>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Archive items={archiveItems} onItemClick={handleArchiveItemClick} />
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? (
          <LoadingAnimation />
        ) : currentPodcast ? (
          <>
            <CustomAudioPlayer audioUrl={currentPodcast.audioUrl} onTimeUpdate={setCurrentTime} />
            <Transcript transcript={currentPodcast.transcript} currentTime={currentTime} />
          </>
        ) : null}
      </Modal>
    </main>
  )
}

