import React, { useEffect, useRef, useState } from "react"
import { Chessground as NativeChessground } from "chessground"
import "./Chessground.css"
import { Api as ChessgroundApi } from "chessground/api"
import { DrawShape } from "chessground/draw"
import { Config } from "chessground/config"

type ChessgroundProps = Omit<Config, "drawable"> & {
  onDraw?: (shapes: DrawShape[]) => void
  shapes?: DrawShape[]
}

const Chessground: React.FC<ChessgroundProps> = ({
  children,
  shapes,
  onDraw,
  ...chessgroundProps
}) => {
  const el = useRef<HTMLDivElement>(null)
  const [ground, setGround] = useState<ChessgroundApi>()

  // Initialize and destory on mount/unmount only
  useEffect(() => {
    if (el.current && !ground) {
      setGround(NativeChessground(el.current, {}))
    }
    return () => {
      if (ground) {
        ground.destroy()
      }
    }
  }, [ground])

  // Update props after initialization is complete
  useEffect(() => {
    if (ground) {
      ground.set(
        Object.assign(chessgroundProps, { drawable: { onChange: onDraw } })
      )
      if (shapes) {
        ground.setShapes(shapes)
      }
    }
  }, [ground, chessgroundProps, onDraw, shapes])

  return <div ref={el}>{children}</div>
}

export default Chessground
