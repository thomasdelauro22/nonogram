import Button from "@/components/Button";
import Gameboard from "@/components/Gameboard";
import { Board } from "../types/Board";

export default function Home() {
  const board = new Board();
  const boardWidth = 10;
  const boardHeight = 10;
  const hints = [
    ["3", "2"],
    ["2", "2"],
    ["1", "4"],
    ["5"],
    ["5", "1"],
    ["6", "1"],
    ["2", "4"],
    ["5"],
    ["7"],
    ["6"],
    ["3", "1"],
    ["2", "2"],
    ["1", "4"],
    ["5", "1"],
    ["6", "2"],
    ["6", "3"],
    ["1", "1", "4"],
    ["4"],
    ["4"],
    ["6"],
  ];
  board.initialize(boardWidth, boardHeight);

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard width={boardWidth} height={boardHeight} hints={hints} />
    </div>
  );
}
