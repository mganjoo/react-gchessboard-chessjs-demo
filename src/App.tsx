import "gchessboard"
import React, { useState } from "react"
import { ChessInstance, PieceType, Square } from "chess.js"
import classNames from "classnames"
import { GChessBoard } from "./GChessBoard"

const ChessReq = require("chess.js")

type PromotablePiece = Exclude<PieceType, "p" | "k">

function toColor(chess: ChessInstance): "white" | "black" {
  return chess.turn() === "w" ? "white" : "black"
}

const App: React.FC = () => {
  const [chess] = useState<ChessInstance>(new ChessReq())
  const [fen, setFen] = useState(chess.fen())
  const [orientation, setOrientation] = useState<"white" | "black">("white")
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<[Square, Square]>()

  const [pgn, setPgn] = useState<string>()

  const handleMoveStart = (e: Event) => {
    const { from, setTargets } = (e as CustomEvent).detail
    setTargets(chess.moves({ square: from, verbose: true }).map((m) => m.to))
  }

  const handleMoveEnd = (e: Event) => {
    const detail = (e as CustomEvent).detail
    const isPromotion = chess
      .moves({ verbose: true })
      .some(
        (move) => move.flags.indexOf("p") !== -1 && move.from === detail.from
      )

    if (isPromotion) {
      setPendingPromotion([detail.from, detail.to])
      setShowPromotionDialog(true)
    }
    const move = chess.move({
      from: detail.from,
      to: detail.to,
      promotion: "q",
    })
    if (move === null) {
      e.preventDefault()
    }
  }

  const handleMoveFinished = (e: Event) => {
    setFen(chess.fen())
    if (!pendingPromotion) {
      setPgn(chess.pgn())
    }
  }

  const handlePromotion: (piece: PromotablePiece) => void = (piece) => {
    if (pendingPromotion) {
      chess.undo()
      chess.move({
        from: pendingPromotion[0],
        to: pendingPromotion[1],
        promotion: piece,
      })
      setFen(chess.fen())
      setPgn(chess.pgn())
      setPendingPromotion(undefined)
    }
    setShowPromotionDialog(false)
  }

  const reset = () => {
    chess.reset()
    setFen(chess.fen())
    setPgn(chess.pgn())
  }

  const undo = () => {
    if (chess.undo()) {
      setFen(chess.fen())
      setPgn(chess.pgn())
    }
  }

  const getKingSquareForSide = () => {
    if (!chess.in_check()) {
      return undefined
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const label = String.fromCharCode("a".charCodeAt(0) + i).concat(
          (j + 1).toString()
        )
        const piece = chess.get(label as Square)
        if (piece?.type === "k" && piece.color === chess.turn()) {
          return label as Square
        }
      }
    }
    return undefined
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
    <>
      <main className="max-w-xl px-4 py-6 mx-auto">
        <GChessBoard
          fen={fen}
          orientation={orientation}
          turn={toColor(chess)}
          interactive={!chess.game_over()}
          onmovestart={handleMoveStart}
          onmoveend={handleMoveEnd}
          onmovefinished={handleMoveFinished}
        >
          <div className="check-marker" slot={getKingSquareForSide()}></div>
        </GChessBoard>
        <div className="py-2 space-y-2 sm:flex-auto sm:flex sm:flex-row sm:space-x-2 sm:space-y-0 sm:justify-center">
          <button
            className="c-button"
            onClick={() =>
              setOrientation(orientation === "white" ? "black" : "white")
            }
          >
            Flip
          </button>
          <button className="c-button" onClick={reset}>
            Reset Board
          </button>
          <button
            className="c-button"
            onClick={undo}
            disabled={!chess.history().length}
          >
            Undo Move
          </button>
        </div>
        {chess.game_over() && (
          <div className="py-2 mt-2 mb-4 text-center text-gray-100 bg-gray-900">
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
          <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block my-4 overflow-hidden text-left align-middle transition-all bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="mb-3 sm:flex sm:items-center sm:justify-center">
                  <div className="mt-3 text-center sm:mt-0">
                    <h3
                      className="text-xl font-medium leading-6 text-gray-900"
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
      <footer className="w-full mt-4 text-sm text-center text-gray-700">
        Built using{" "}
        <a href="https://github.com/mganjoo/gchessboard">gchessboard</a> +{" "}
        <a href="https://github.com/jhlywa/chess.js">chess.js</a>.{" "}
        <a href="https://github.com/mganjoo/react-chessground-chessjs-demo">
          View project on GitHub
        </a>
        .
      </footer>
    </>
  )
}

export default App
