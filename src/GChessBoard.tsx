import * as React from "react"
import { EventName, createComponent } from "@lit/react"
import {
  GChessBoardElement,
  MoveCancelEvent,
  MoveEndEvent,
  MoveFinishedEvent,
  MoveStartEvent,
} from "gchessboard"

export const GChessBoard = createComponent({
  react: React,
  tagName: "g-chess-board",
  elementClass: GChessBoardElement,
  events: {
    onMoveStart: "movestart" as EventName<CustomEvent<MoveStartEvent>>,
    onMoveEnd: "moveend" as EventName<CustomEvent<MoveEndEvent>>,
    onMoveCancel: "movecancel" as EventName<CustomEvent<MoveCancelEvent>>,
    onMoveFinished: "movefinished" as EventName<CustomEvent<MoveFinishedEvent>>,
  },
})
