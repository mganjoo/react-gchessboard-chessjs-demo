import React, { useState } from "react"
import Chessground from "./Chessground"

const App: React.FC = () => {
  const [whiteToPlay, setWhiteToPlay] = useState(true)

  return (
    <div className="p-3 w-96">
      <Chessground orientation={whiteToPlay ? "white" : "black"} />
      <div className="flex flex-auto space-x-2">
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
    </div>
  )
}

export default App
