import Button from "@/components/Button";
import Gameboard from "@/components/Gameboard";
import { Board } from "../types/Board";
import { hints1, hints2 } from "@/puzzles";

export default function Home() {
  const board = new Board();
  const boardWidth = 10;
  const boardHeight = 10;
  board.initialize(boardWidth, boardHeight);

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard width={boardWidth} height={boardHeight} hints={hints2} />
    </div>
  );
}
