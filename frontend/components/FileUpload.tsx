import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { pdfToText } from 'pdf-ts';
import up from '/public/up.svg'
import { set } from "date-fns";

interface FileUploadProps {
  onFileSelect: (file: File, loc: string, transcript: string) => void;
  setIsModalOpen: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setAudioUrl: (val: string) => void;
  setTranscript: (val: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, setIsModalOpen, setIsLoading, setAudioUrl, setTranscript }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      setIsModalOpen(true);
      setIsLoading(true);
      try 
      {
        const res = await fetch("http://127.0.0.1:8000/upload-file", {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        console.log("DATA: ", data);
        // await setAudioUrl(data.loc);
        // await setTranscript(data.transcript);
        onFileSelect(selectedFile, data.loc, data.transcript);
      }
      catch (error) 
      {
        console.error(error)
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="font-libre-baskerville cursor-pointer bg-violet-500 text-white py-2 px-4 rounded-md border-2 border-black border-solid hover:bg-blue-600 transition duration-300">
        Submit your troubles here
        <img src={up.src} alt="up" className="pl-2 pb-2 w-7 inline" />
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
      </label>
      {selectedFile && <p className="text-sm font-libre-baskerville">{selectedFile.name}</p>}
      <Button
        onClick={handleSubmit}
        disabled={!selectedFile}
        className={`font-libre-baskerville rounded-lg border-2 border-black border-solid py-2 px-4 transition duration-300 bg-lime-500 text-white}`}>
        Upload
      </Button>
    </div>
  )
}

export default FileUpload

