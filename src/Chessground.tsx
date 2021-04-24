import React, { useEffect, useRef, useState } from "react"
import { Chessground as NativeChessground } from "chessground"
import "./Chessground.css"
import { Api as ChessgroundApi } from "chessground/api"
import { Config } from "chessground/config"
import * as cg from "chessground/types"
import CSS from "csstype"

type ChessgroundProps = Omit<Config, "events"> &
  Pick<CSS.Properties, "width" | "height"> & {
    onChange?: () => void
    onMove?: (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => void
    onDropNewPiece?: (piece: cg.Piece, key: cg.Key) => void
    onSelect?: (key: cg.Key) => void
    onInsert?: (elements: cg.Elements) => void
  }

const Chessground: React.FC<ChessgroundProps> = ({
  children,
  width,
  height,
  onChange,
  onMove,
  onDropNewPiece,
  onSelect,
  onInsert,
  ...chessgroundProps
}) => {
  const el = useRef<HTMLDivElement>(null)
  const ground = useRef<ChessgroundApi>()
  const [initialized, setInitialized] = useState(false)

  // Initialize and destory on mount/unmount only
  useEffect(() => {
    if (el.current) {
      ground.current = NativeChessground(el.current, {})
      setInitialized(true)
    }
    return () => {
      if (ground.current) {
        ground.current.destroy()
      }
    }
  }, [])

  // Update props after initialization is complete
  useEffect(() => {
    if (initialized && ground.current) {
      ground.current.set(chessgroundProps)
    }
  }, [initialized, chessgroundProps])

  return (
    <div ref={el} style={{ width: width, height: height }}>
      {children}
    </div>
  )
}

export default Chessground
