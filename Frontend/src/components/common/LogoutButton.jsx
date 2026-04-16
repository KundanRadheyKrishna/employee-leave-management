import React from 'react'

const LogoutButton = ({onClick}) => {
  return (
    <div>
       <button
      onClick={onClick}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
    </div>
  )
}

export default LogoutButton
