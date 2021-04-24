import React, { useState } from "react"
import Chessground from "./Chessground"

const App: React.FC = () => {
  const [whiteToPlay, setWhiteToPlay] = useState(true)

  return (
    <div>
      <Chessground orientation={whiteToPlay ? "white" : "black"} />
      <button onClick={() => setWhiteToPlay(!whiteToPlay)}>Flip</button>
    </div>
  )
}

export default App
