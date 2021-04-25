import React, { useState } from "react"
import Chessground from "./Chessground"
import { ChessInstance, Square } from "chess.js"
import * as cg from "chessground/types"
import { DrawShape } from "chessground/draw"

const ChessReq = require("chess.js")

function toDests(chess: ChessInstance): Map<cg.Key, cg.Key[]> {
  const dests = new Map()
  chess.SQUARES.forEach((square) => {
    const moves = chess.moves({ square: square, verbose: true })
    if (moves.length) {
      dests.set(
        square,
        moves.map((move) => move.to)
      )
    }
  })
  return dests
}

function toColor(chess: ChessInstance): cg.Color {
  return chess.turn() === "w" ? "white" : "black"
}

const App: React.FC = () => {
  const [chess] = useState<ChessInstance>(new ChessReq())
  const [fen, setFen] = useState(chess.fen())
  const [orientation, setOrientation] = useState<cg.Color>("white")
  const [lastMove, setLastMove] = useState<cg.Key[]>()
  const [shapes, setShapes] = useState<DrawShape[]>()

  const updateBoard = () => {
    setFen(chess.fen())
  }

  const handleMove: (orig: cg.Key, dest: cg.Key) => void = (orig, dest) => {
    chess.move({ from: orig as Square, to: dest as Square })
    updateBoard()
    setLastMove([orig, dest])
  }

  const handleDraw: (newShapes: DrawShape[]) => void = (newShapes) => {
    setShapes(newShapes)
  }

  const reset = () => {
    chess.reset()
    setShapes(undefined)
    updateBoard()
    setLastMove(undefined)
  }

  return (
    <main className="max-w-xl mx-auto py-6 px-4">
      <Chessground
        fen={fen}
        orientation={orientation}
        turnColor={toColor(chess)}
        lastMove={lastMove}
        check={chess.in_check()}
        movable={{
          free: false,
          color: toColor(chess),
          dests: toDests(chess),
          events: { after: handleMove },
        }}
        premovable={{ enabled: false }}
        onDraw={handleDraw}
        shapes={shapes}
      />
      <div className="flex flex-auto space-x-2 py-2">
        <button
          className="w-1/2 flex items-center justify-center rounded-md border border-gray-300"
          onClick={() =>
            setOrientation(orientation === "white" ? "black" : "white")
          }
        >
          Flip
        </button>
        <button
          className="w-1/2 flex items-center justify-center rounded-md border border-gray-300"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </main>
  )
}

export default App
