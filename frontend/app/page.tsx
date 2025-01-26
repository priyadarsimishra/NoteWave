"use client"

import React, { useState } from "react"
import { useRef, useEffect } from "react"
import Header from "@/components/Header"
import FileUpload from "@/components/FileUpload"
import Modal from "@/components/Modal"
import LoadingAnimation from "@/components/LoadingAnimation"
import CustomAudioPlayer from "@/components/CustomAudioPlayer"
import Transcript from "@/components/Transcript"
import Archive from "@/components/Archive"
import "react-h5-audio-player/lib/styles.css"
import aws from "./aws.svg"

interface PodcastData {
  id: string
  audioUrl: string
  transcript: string
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPodcast, setCurrentPodcast] = useState<PodcastData | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [transcript, setTranscript] = useState<string>('')
  const [currentTime, setCurrentTime] = useState(0)
  const [archiveItems, setArchiveItems] = useState<{ id: string; title: string; date: string }[]>([])
  
  const audioPlayerRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current
    if (audioPlayer) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioPlayer.currentTime)
      }
      audioPlayer.addEventListener('timeupdate', handleTimeUpdate)
      return () => {
        audioPlayer.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [])

  const handleFileSelect = async (file: File, loc: string, transcript: string) => {
    console.log("LOGC: ", loc.substring(loc.indexOf("public") + 6))
    const newPodcast: PodcastData = {
      id: Date.now().toString(),
      audioUrl: loc.substring(loc.indexOf("public") + 6), // Replace with actual audio URL
      transcript: transcript,
    }

    setAudioUrl(loc.substring(loc.indexOf("public") + 6));
    setTranscript(newPodcast.transcript)

    setCurrentPodcast(newPodcast)
    // setIsLoading(false)

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
      audioUrl: audioUrl, // Replace with actual audio URL
      transcript: transcript,
    }

    setCurrentPodcast(selectedPodcast)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-custom-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-20 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="border-2 border-black border-solid bg-white p-6 rounded-lg shadow-lg">
              <h2 className=" text-3xl font-libre-baskerville font-medium mb-2">Create a Podcast</h2>
              <h3 className="font-libre-baskerville text-sm text-gray-600 mb-10">Only supports PDF format*</h3>
              <FileUpload onFileSelect={handleFileSelect} setIsModalOpen={setIsModalOpen} setIsLoading={setIsLoading} setAudioUrl={setAudioUrl} setTranscript={setTranscript}/>
            </div>
            <div> 
              <h1 className="mt-10 font-libre-baskerville  text-rose-600 text-2xl">Workaholics aren't heroes. They don't save the day, they use it up. </ h1>
              <h1 className="mt-2 font-libre-baskerville  text-rose-700 text-2xl">The real hero is already home... Because they figured out a faster way to get things done.</ h1>
              <h1 className="mt-5 font-libre-baskerville italic text-rose-900 text-xl">- Jason Friend & David Heinemeier Hansson</ h1>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Archive items={archiveItems} onItemClick={handleArchiveItemClick} />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-libre-baskerville font-bold">Built using  </h2>
          <img src={"./aws.svg"} alt="AWS Logo" className="ml-5 w-8 h-8 object-contain" />
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

