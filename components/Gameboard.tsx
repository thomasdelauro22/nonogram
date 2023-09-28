import { useRef, useEffect, useState } from "react";
import Hints from "./Hints";
import Pixel from "./Pixel";
import StatePixel from "./StatePixel";
import { isLineComplete, numHintsSatisfied } from "@/solver/line";
import Button from "./Button";

export type GameboardTypes = {
  width: number;
  height: number;
  hints: string[][]; // given [rowHints, colHints]
};

const Gameboard: React.FC<GameboardTypes> = ({ width, height, hints }) => {
  let pixelArray: JSX.Element[][] = [];
  let pixelStates: any[][] = [];
  let pixelRefs: any[][] = [];

  const resetBoard = () => {
    for (let pixelRow of pixelStates) {
      for (let pixel of pixelRow) {
        pixel[1]("unknown");
      }
    }
    for (let hint of satisfiedHints) {
      hint[1]({
        start: 0,
        end: 0,
      });
    }
  };

  // Pixels set this value each time they change
  // so we can check the completion status of the line
  const [stateRowChange, setStateRowChange] = useState(-1);
  const [stateColChange, setStateColChange] = useState(-1);

  // Controls what state the pixels are set to when clicked
  const [mouseState, setMouseState] = useState("shaded");

  // Used for drag clicking
  const [mouseDownRow, setMouseDownRow] = useState(-1);
  const [mouseDownCol, setMouseDownCol] = useState(-1);
  const [mouseUpRow, setMouseUpRow] = useState(-1);
  const [mouseUpCol, setMouseUpCol] = useState(-1);

  // Keeps track of which hints are satisfied
  let satisfiedHints: any[] = [];
  for (let i = 0; i < hints.length; i++) {
    const [lineHintsSatisfied, setLineHintsSatsisfied] = useState({
      start: 0,
      end: 0,
    });
    satisfiedHints.push([lineHintsSatisfied, setLineHintsSatsisfied]);
  }

  // Helper function for checking/updated row/col hint progress
  const checkRowAndCol = (rowChange: number, colChange: number) => {
    if (rowChange !== -1 && colChange !== -1) {
      // Check if newly changed row is satisfied
      const pixelRow = pixelStates[rowChange];
      const pixelRowStates = pixelRow.map((x) => x[0]);
      const pixelRowStateControls = pixelRow.map((x) => x[1]);
      const pixelRowHints = hints[rowChange];
      if (isLineComplete(pixelRowHints, pixelRowStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelRow.length; i++) {
          if (pixelRowStates[i] === "unknown") {
            pixelRowStateControls[i]("unshaded");
          }
        }
        satisfiedHints[rowChange][1]({
          start: pixelRowHints.length,
          end: 0,
        });
      } else {
        // Update row's completed hints
        satisfiedHints[rowChange][1]({
          start: numHintsSatisfied(pixelRowHints, pixelRowStates, true),
          end: numHintsSatisfied(pixelRowHints, pixelRowStates, false),
        });
      }
      let pixelColStates = [];
      let pixelColStateControls = [];
      const pixelColHints = hints[height + colChange];
      for (let i = 0; i < height; i++) {
        pixelColStates.push(pixelStates[i][colChange][0]);
        pixelColStateControls.push(pixelStates[i][colChange][1]);
      }
      // Check if newly changed col is satisfied
      if (isLineComplete(pixelColHints, pixelColStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelColStates.length; i++) {
          if (pixelColStates[i] === "unknown") {
            pixelColStateControls[i]("unshaded");
          }
        }
        satisfiedHints[colChange + height][1]({
          start: pixelColHints.length,
          end: 0,
        });
      } else {
        satisfiedHints[colChange + height][1]({
          start: numHintsSatisfied(pixelColHints, pixelColStates, true),
          end: numHintsSatisfied(pixelColHints, pixelColStates, false),
        });
      }
    }
    setStateColChange(-1);
    setStateRowChange(-1);
  };

  // Used for shading multiple pixels at once via dragging the mouse
  useEffect(() => {
    if (
      mouseUpCol !== -1 &&
      mouseUpRow !== -1 &&
      !(mouseDownCol === mouseUpCol && mouseDownRow === mouseUpRow)
    ) {
      // Check if the rows or cols match
      // If so, apply shading to entire line if ont all cells are that state
      // Otherwise, set them all to unknown
      if (mouseDownCol === mouseUpCol) {
        const minRow = Math.min(mouseDownRow, mouseUpRow);
        const maxRow = Math.max(mouseDownRow, mouseUpRow);
        let allMouseState = true;
        for (let i = minRow; i < maxRow + 1; i++) {
          if (pixelStates[i][mouseDownCol][0] !== mouseState) {
            allMouseState = false;
            break;
          }
        }
        for (let i = minRow; i < maxRow + 1; i++) {
          setTimeout(() => pixelRefs[i][mouseDownCol].current.click(), 0);
        }
      }
      if (mouseDownRow === mouseUpRow) {
        const minCol = Math.min(mouseDownCol, mouseUpCol);
        const maxCol = Math.max(mouseDownCol, mouseUpCol);
        let allMouseState = true;
        for (let i = minCol; i < maxCol + 1; i++) {
          if (pixelStates[mouseDownRow][i][0] !== mouseState) {
            allMouseState = false;
            break;
          }
        }
        for (let i = minCol; i < maxCol + 1; i++) {
          setTimeout(() => pixelRefs[mouseDownRow][i].current.click(), 0);
        }
      }
    }
    setMouseDownCol(-1);
    setMouseDownRow(-1);
    setMouseUpCol(-1);
    setMouseUpRow(-1);
  }, [mouseUpCol, mouseUpRow]);

  useEffect(() => {
    console.log(stateRowChange, stateColChange, ' just changed')
    checkRowAndCol(stateRowChange, stateColChange);
  }, [stateRowChange, stateColChange]);

  // Construct initial pixel state
  for (let i = 0; i < height; i++) {
    let pixelRow = [];
    let pixelRefRow = [];
    for (let j = 0; j < width; j++) {
      const [pixelState, setPixelState] = useState("unknown");
      pixelRow.push([pixelState, setPixelState]);
      pixelRefRow.push(useRef<HTMLDivElement>(null));
    }
    pixelStates.push(pixelRow);
    pixelRefs.push(pixelRefRow);
  }

  // Find longest length hint for styling
  let longestColHintLen = 0;
  for (let j = 0; j < width; j++) {
    if (hints[height + j].length > longestColHintLen) {
      longestColHintLen = hints[height + j].length;
    }
  }

  // Place col hints
  let colHints: JSX.Element[] = [];
  for (let j = 0; j < width; j++) {
    colHints.push(
      <Hints
        lineHints={hints[height + j]}
        startHintsSatisfied={satisfiedHints[height + j][0].start}
        endHintsSatisfied={satisfiedHints[height + j][0].end}
        isColHint={true}
        longestColHintLen={longestColHintLen}
        classname="w-[2.06075rem] noHover"
      ></Hints>
    );
  }
  pixelArray.push([
    <div className="flex flex-row relative justify-center ml-[1.3rem] -mt-48">
      {colHints}
    </div>,
  ]);

  // Place rows of pixels
  for (let i = 0; i < height; i++) {
    let pixelRow: JSX.Element[] = [];
    // Row hint
    pixelRow.push(
      <Hints
        lineHints={hints[i]}
        startHintsSatisfied={satisfiedHints[i][0].start}
        endHintsSatisfied={satisfiedHints[i][0].end}
        isColHint={false}
        classname={`w-64 text-right noHover`}
        longestColHintLen={longestColHintLen}
      ></Hints>
    );
    for (let j = 0; j < width; j++) {
      // Pixels
      pixelRow.push(
        <Pixel
          ref = {pixelRefs[i][j]}
          stateControls={pixelStates[i][j]}
          setStateRowChange={setStateRowChange}
          setStateColChange={setStateColChange}
          row={i}
          col={j}
          mouseState={mouseState}
          mouseDownCol={mouseDownCol}
          mouseDownRow={mouseDownRow}
          setMouseDownCol={setMouseDownCol}
          setMouseDownRow={setMouseDownRow}
          setMouseUpCol={setMouseUpCol}
          setMouseUpRow={setMouseUpRow}
        ></Pixel>
      );
    }
    pixelArray.push([
      <div className="flex flex-row relative justify-center -ml-64">
        {pixelRow}
      </div>,
    ]);
  }

  return (
    <>
      {pixelArray}
      <div className="flex flex-row relative justify-center mt-8">
        <StatePixel
          currState={mouseState}
          stateValue="shaded"
          setMouseState={setMouseState}
        />
        <StatePixel
          currState={mouseState}
          stateValue="unshaded"
          setMouseState={setMouseState}
        />
      </div>
      <div className="flex flex-row relative justify-center mt-8">
        <Button text="Reset" onClick={resetBoard} className="mb-16" />
      </div>
    </>
  );
};

export default Gameboard;
