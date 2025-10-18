import { useState } from 'react'
import { BiTrash } from 'react-icons/bi'

const avatarOptions = [
  'https://i.pravatar.cc/100?img=1',
  'https://i.pravatar.cc/100?img=2',
  'https://i.pravatar.cc/100?img=3',
  'https://i.pravatar.cc/100?img=4',
  'https://i.pravatar.cc/100?img=5',
  // Add more as needed
]

const ProfileAvatar = ({ avatar, editMode, onPhotoChange, onPhotoDelete }) => {
  const [showPicker, setShowPicker] = useState(false)

  const handleSelect = (url) => {
    onPhotoChange(url)
    setShowPicker(false)
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <img
          src={avatar}
          alt="User avatar"
          className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover"
        />
        {editMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-white text-sm font-semibold px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
            >
              Change
            </button>
            <button
              onClick={onPhotoDelete}
              className="ml-2 text-white text-sm font-semibold px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition"
            >
              <BiTrash className="inline-block w-4 h-4 mr-1" />
              Remove
            </button>
          </div>
        )}
        {showPicker && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white p-3 rounded-lg shadow flex gap-2 z-10">
            {avatarOptions.map((url) => (
              <button
                key={url}
                onClick={() => handleSelect(url)}
                className="focus:outline-none"
              >
                <img
                  src={url}
                  alt="Avatar option"
                  className="w-12 h-12 rounded-full border-2 border-yellow-300 hover:border-yellow-500"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileAvatar