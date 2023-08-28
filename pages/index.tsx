import { Board } from "../types/Board";

import Gameboard from "@/components/Gameboard";

export default function Home() {
  const board = new Board();
  const boardWidth = 5;
  const boardHeight = 5;
  const hints = [
    ["2"],
    ["3"],
    ["1"],
    ["2", "2"],
    ["2", "1"],
    ["3"],
    ["1", "2"],
    ["2"],
    ["1", "1"],
    ["1", "2"],
  ];
  board.initialize(boardWidth, boardHeight);

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard width={boardWidth} height={boardHeight} hints={hints} />
    </div>
  );
}
