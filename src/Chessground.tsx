import React, { useEffect, useRef, useState } from "react"
import { Chessground as NativeChessground } from "chessground"
import "./Chessground.css"
import { Api as ChessgroundApi } from "chessground/api"
import { Config } from "chessground/config"

const Chessground: React.FC<Config> = ({ children, ...chessgroundProps }) => {
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

  return <div ref={el}>{children}</div>
}

export default Chessground
