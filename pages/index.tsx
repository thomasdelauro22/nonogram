import Gameboard from "@/components/Gameboard";
import { hints1, hints2 } from "@/puzzles";

export default function Home() {
  const boardWidth = 10;
  const boardHeight = 10;

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard width={boardWidth} height={boardHeight} hints={hints2} />
    </div>
  );
}
