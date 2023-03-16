"use strict";
exports.__esModule = true;
var Board_1 = require("@/types/Board");
var run = function () {
    var gameBoard = new Board_1.Board;
    var boardWidth = 5;
    var boardHeight = 5;
    gameBoard.initialize(boardWidth, boardHeight);
    console.log(gameBoard.pixels);
};
run();
