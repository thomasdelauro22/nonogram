import Button from "@/components/Button";
import Gameboard from "@/components/Gameboard";
import { hints1, hints2 } from "@/puzzles";
import _ from "lodash";
import { useState } from "react";

export default function Home() {
  const boardWidth = 10;
  const boardHeight = 10;
  const [hints, setHints] = useState(hints1);
  const swapPuzzle = () => {
    if (_.isEqual(hints1, hints)) {
      setHints(hints2);
    } else {
      setHints(hints1);
    }
  };

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard
        width={boardWidth}
        height={boardHeight}
        hints={hints}
        swapPuzzle={swapPuzzle}
      />
    </div>
  );
}
