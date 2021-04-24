import React, { useState } from "react"
import Chessground from "./Chessground"

const App: React.FC = () => {
  const [whiteToPlay, setWhiteToPlay] = useState(true)

  return (
    <main className="max-w-xl mx-auto py-6 px-4">
      <Chessground
        orientation={whiteToPlay ? "white" : "black"}
        premovable={{ enabled: false }}
      />
      <div className="flex flex-auto space-x-2 py-2">
        <button
          className="w-1/2 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() => setWhiteToPlay(!whiteToPlay)}
        >
          Flip
        </button>
        <button className="w-1/2 flex items-center justify-center rounded-md border border-gray-300">
          Reset
        </button>
      </div>
    </main>
  )
}

export default App
