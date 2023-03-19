import { Board } from "../types/Board";

import Gameboard from "@/components/Gameboard";

export default function Home() {
  const board = new Board();
  const boardWidth = 8;
  const boardHeight = 2;
  board.initialize(boardWidth, boardHeight);

  return (
    <div className="mt-64">
      <Gameboard width={boardWidth} height={boardHeight} />
    </div>
  );
}
