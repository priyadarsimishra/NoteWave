import type React from "react"

interface ArchiveItem {
  id: string
  title: string
  date: string
}

interface ArchiveProps {
  items: ArchiveItem[]
  onItemClick: (id: string) => void
}

const Archive: React.FC<ArchiveProps> = ({ items, onItemClick }) => {
  const emptyRows = 6 - items.length

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-100">Archive</h2>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition duration-150 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            }`}
            onClick={() => onItemClick(item.id)}
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.date}</p>
          </div>
        ))}
        {Array.from({ length: emptyRows }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className={`p-4 ${(index + items.length) % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
          >
            <h3 className="font-medium text-gray-300">Empty</h3>
            <p className="text-sm text-gray-300">No date</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Archive

