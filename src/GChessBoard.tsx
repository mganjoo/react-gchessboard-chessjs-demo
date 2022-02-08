import * as React from "react"
import { createComponent } from "@lit-labs/react"
import { GChessBoardElement } from "gchessboard"

export const GChessBoard = createComponent(
  React,
  "g-chess-board",
  GChessBoardElement,
  {
    onmovestart: "movestart",
    onmoveend: "moveend",
    onmovecancel: "movecancel",
    onmovefinished: "movefinished",
  }
)
