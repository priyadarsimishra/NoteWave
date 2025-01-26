import type React from "react"

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-6">
          <div className="logo">
            <img src="/newlogo.svg" alt="Logo" className="h-36 w-auto" />
          </div>

          <div className="text-center flex-1 -ml-24">
            <h1 className="header-title">NoteWave</h1>
            <p className="header-description">Turn your notes into interactive podcasts that make learning easier and more engaging.</p>
          </div>
    </header>
  )
}

export default Header

