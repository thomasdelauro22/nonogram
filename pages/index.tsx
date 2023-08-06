import { Board } from "../types/Board";

import Gameboard from "@/components/Gameboard";

export default function Home() {
  const board = new Board();
  const boardWidth = 7;
  const boardHeight = 5;
  const hints = [
    ['1', '2', '3', '3'],
    ['2', '2', '3', '3'],
    ['3', '2', '3', '3'],
    ['4', '2', '3', '3'],
    ['5', '2', '3', '3'],
    ['6', '2', '3', '3'],
    ['7', '2', '3', '3'],
    ['8', '2', '3', '3'],
    ['9', '2', '3', '3'],
    ['0', '2', '3', '3'],
    ['1', '2', '3', '3'],
    ['2', '2', '3', '3'],
    ['3', '2', '3', '3'],
    ['4', '2', '3', '3'],
    ['5', '2', '3', '3'],
    ['6', '2', '3', '3'],
    ['7', '2', '3', '3'],
    ['8', '2', '3', '3'],
    ['9', '2', '3', '3'],
    ['0', '2', '3', '3'],
];
  board.initialize(boardWidth, boardHeight);

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard width={boardWidth} height={boardHeight} hints={hints}/>
    </div>
  );
}
