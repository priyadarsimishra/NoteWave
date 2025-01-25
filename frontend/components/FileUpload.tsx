import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">
        Submit your troubles here
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
      </label>
      {selectedFile && <p className="text-sm text-gray-600">{selectedFile.name}</p>}
      <Button onClick={handleSubmit} disabled={!selectedFile} className="rounded-full">
        Submit
      </Button>
    </div>
  )
}

export default FileUpload

