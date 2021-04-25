import React, { useEffect, useRef, useState } from "react"
import { Chessground as NativeChessground } from "chessground"
import "./Chessground.css"
import { Api as ChessgroundApi } from "chessground/api"
import { Config } from "chessground/config"

const Chessground: React.FC<Config> = ({ children, ...chessgroundProps }) => {
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
      ground.set(chessgroundProps)
    }
  }, [ground, chessgroundProps])

  return <div ref={el}>{children}</div>
}

export default Chessground
