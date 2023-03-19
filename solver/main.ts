import { Board } from "../types/Board";

const run = () => {
  let gameBoard = new Board();
  const boardWidth = 5;
  const boardHeight = 5;
  gameBoard.initialize(boardWidth, boardHeight);
  console.log(gameBoard.pixels);
};

run();
