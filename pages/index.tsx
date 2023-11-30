import Button from "@/components/Button";
import Gameboard from "@/components/Gameboard";
import { hints1, hints3 } from "@/puzzles";
import _ from "lodash";
import { useState } from "react";

export default function Home() {
  const boardWidth = 20;
  const boardHeight = 20;
  const swapPuzzle = () => {

  };

  return (
    <div className="h-screen w-screen py-64">
      <Gameboard
        width={boardWidth}
        height={boardHeight}
        hints={hints3}
        swapPuzzle={swapPuzzle}
      />
    </div>
  );
}
