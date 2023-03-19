import { Board } from "../types/Board";

import Gameboard from "@/components/Gameboard";

export default function Home() {
  const board = new Board();
  const boardWidth = 5;
  const boardHeight = 5;
  board.initialize(boardWidth, boardHeight);

  return (
    <>
      <Gameboard width={boardWidth} height={boardHeight} />
    </>
  );
}
