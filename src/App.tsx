import React, { useState } from "react"
import Chessground from "./Chessground"
import { ChessInstance, PieceType, Square } from "chess.js"
import * as cg from "chessground/types"
import { DrawShape } from "chessground/draw"
import classNames from "classnames"

const ChessReq = require("chess.js")

type PromotablePiece = Exclude<PieceType, "p" | "k">

function toDests(chess: ChessInstance): Map<cg.Key, cg.Key[]> {
  const dests = new Map()
  if (!chess.game_over()) {
    chess.SQUARES.forEach((square) => {
      const moves = chess.moves({ square: square, verbose: true })
      if (moves.length) {
        dests.set(
          square,
          moves.map((move) => move.to)
        )
      }
    })
  }
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
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [pendingMove, setPendingMove] = useState<[cg.Key, cg.Key]>()
  const [pgn, setPgn] = useState<string>()

  const updateBoard = (
    move?: [cg.Key, cg.Key],
    promotion?: PromotablePiece
  ) => {
    if (move) {
      chess.move({
        from: move[0] as Square,
        to: move[1] as Square,
        promotion: promotion,
      })
    }
    setFen(chess.fen())
    setLastMove(move)
    setPgn(chess.pgn())
  }

  const handleMove: (orig: cg.Key, dest: cg.Key) => void = (orig, dest) => {
    const isPromotion = chess
      .moves({ verbose: true })
      .some((move) => move.flags.indexOf("p") !== -1 && move.from === orig)

    if (isPromotion) {
      setPendingMove([orig, dest])
      setShowPromotionDialog(true)
    } else {
      updateBoard([orig, dest])
    }
  }

  const handleDraw: (newShapes: DrawShape[]) => void = (newShapes) => {
    setShapes(newShapes)
  }

  const handlePromotion: (piece: PromotablePiece) => void = (piece) => {
    updateBoard(pendingMove, piece)
    setShowPromotionDialog(false)
  }

  const reset = () => {
    chess.reset()
    setShapes(undefined)
    updateBoard()
  }

  const gameStatus: () => string = () => {
    if (chess.in_stalemate()) {
      return "Stalemate"
    } else if (chess.in_checkmate()) {
      const winningSide = chess.turn() === "w" ? "Black" : "White"
      return `Checkmate: ${winningSide} wins`
    } else if (chess.in_threefold_repetition()) {
      return "Draw by threefold repetition"
    } else if (chess.insufficient_material()) {
      return "Draw by insufficient material"
    } else if (chess.in_draw()) {
      return "Draw"
    } else {
      return ""
    }
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
        viewOnly={chess.game_over()}
      />
      <div className="flex flex-auto space-x-2 py-2 justify-center">
        <button
          className="c-button"
          onClick={() =>
            setOrientation(orientation === "white" ? "black" : "white")
          }
        >
          Flip
        </button>
        <button className="c-button" onClick={reset}>
          Reset
        </button>
      </div>
      {chess.game_over() && (
        <div className="text-center py-2 bg-gray-900 text-gray-100 mt-2 mb-4">
          {gameStatus()}
        </div>
      )}
      <div>{pgn}</div>
      <div
        className={classNames("fixed z-10 inset-0 overflow-y-auto", {
          hidden: !showPromotionDialog,
        })}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-95 transition-opacity"
            aria-hidden="true"
          ></div>
          <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden my-4 shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-center sm:justify-center mb-3">
                <div className="mt-3 text-center sm:mt-0">
                  <h3
                    className="text-xl leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Promote piece
                  </h3>
                </div>
              </div>
              <div className="px-2 py-3 space-y-2 sm:flex sm:flex-row sm:space-x-2 sm:space-y-0 sm:justify-center">
                <button
                  type="button"
                  className="c-button"
                  onClick={() => handlePromotion("q")}
                >
                  Queen
                </button>
                <button
                  type="button"
                  className="c-button"
                  onClick={() => handlePromotion("r")}
                >
                  Rook
                </button>
                <button
                  type="button"
                  className="c-button"
                  onClick={() => handlePromotion("b")}
                >
                  Bishop
                </button>
                <button
                  type="button"
                  className="c-button"
                  onClick={() => handlePromotion("n")}
                >
                  Knight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
