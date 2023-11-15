import { useRef, useEffect, useState, RefObject } from "react";
import Hints from "./Hints";
import Pixel from "./Pixel";
import StatePixel from "./StatePixel";
import { isLineComplete, numHintsSatisfied } from "@/solver/line";
import Button from "./Button";
import { State } from "@/types/Board";
import { PixelState } from "@/utils/constants";

export type GameboardTypes = {
  width: number;
  height: number;
  hints: string[][]; // given [rowHints, colHints]
};

export type HintState = {
  start: number;
  end: number;
}

const Gameboard: React.FC<GameboardTypes> = ({ width, height, hints }) => {
  let pixelArray: JSX.Element[][] = [];
  let pixelStates: State<PixelState>[][] = [];
  let pixelRefs: RefObject<HTMLDivElement>[][] = [];

  const resetBoard = () => {
    for (let pixelRow of pixelStates) {
      for (let pixel of pixelRow) {
        pixel.setState(PixelState.UNKNOWN);
      }
    }
    for (let hint of satisfiedHints) {
      hint.setState({
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
  const [mouseState, setMouseState] = useState(PixelState.SHADED);

  // Used for drag clicking
  const [mouseDownRow, setMouseDownRow] = useState(-1);
  const [mouseDownCol, setMouseDownCol] = useState(-1);
  const [mouseUpRow, setMouseUpRow] = useState(-1);
  const [mouseUpCol, setMouseUpCol] = useState(-1);

  // Keeps track of which hints are satisfied
  let satisfiedHints: State<HintState>[] = [];
  for (let i = 0; i < hints.length; i++) {
    const [lineHintsSatisfied, setLineHintsSatsisfied] = useState({
      start: 0,
      end: 0,
    });
    satisfiedHints.push({
      state: lineHintsSatisfied,
      setState: setLineHintsSatsisfied,
    });
  }

  // Helper function for checking/updated row/col hint progress
  const checkRowAndCol = (rowChange: number, colChange: number) => {
    if (rowChange !== -1 && colChange !== -1) {
      // Check if newly changed row is satisfied
      const pixelRow = pixelStates[rowChange];
      const pixelRowStates = pixelRow.map((x) => x.state);
      const pixelRowStateControls = pixelRow.map((x) => x.setState);
      const pixelRowHints = hints[rowChange];
      const colsToCheck: number[] = [];
      if (isLineComplete(pixelRowHints, pixelRowStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelRow.length; i++) {
          if (pixelRowStates[i] === PixelState.UNKNOWN) {
            colsToCheck.push(i);
            pixelRowStateControls[i](PixelState.UNSHADED);
          }
        }
        // check if the new unknowns complete any column hints
        for (let colToCheck of colsToCheck) {
          let pixelColStates = [];
          for (let i = 0; i < height; i++) {
            const pixelState = pixelStates[i][colToCheck];
            pixelColStates.push(
              i === rowChange ? PixelState.UNSHADED : pixelState.state
            );
          }
          satisfiedHints[height + colToCheck].setState({
            start: numHintsSatisfied(
              hints[height + colToCheck],
              pixelColStates,
              true
            ),
            end: numHintsSatisfied(
              hints[height + colToCheck],
              pixelColStates,
              false
            ),
          });
        }
        satisfiedHints[rowChange].setState({
          start: pixelRowHints.length,
          end: 0,
        });
      } else {
        // Update row's completed hints
        satisfiedHints[rowChange].setState({
          start: numHintsSatisfied(pixelRowHints, pixelRowStates, true),
          end: numHintsSatisfied(pixelRowHints, pixelRowStates, false),
        });
      }
      let pixelColStates = [];
      let pixelColStateControls = [];
      const pixelColHints = hints[height + colChange];
      const rowsToCheck: number[] = [];
      for (let i = 0; i < height; i++) {
        pixelColStates.push(pixelStates[i][colChange].state);
        pixelColStateControls.push(pixelStates[i][colChange].setState);
      }
      // Check if newly changed col is satisfied
      if (isLineComplete(pixelColHints, pixelColStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelColStates.length; i++) {
          if (pixelColStates[i] === PixelState.UNKNOWN) {
            pixelColStateControls[i](PixelState.UNSHADED);
            rowsToCheck.push(i);
          }
        }
        // check if the new unknowns complete any row hints
        for (let rowToCheck of rowsToCheck) {
          satisfiedHints[rowToCheck].setState({
            start: numHintsSatisfied(
              hints[rowToCheck],
              pixelStates[rowToCheck].map((x, i) =>
                i === colChange ? PixelState.UNSHADED : x.state
              ),
              true
            ),
            end: numHintsSatisfied(
              hints[rowToCheck],
              pixelStates[rowToCheck].map((x, i) =>
                i === colChange ? PixelState.UNSHADED : x.state
              ),
              false
            ),
          });
        }
        satisfiedHints[colChange + height].setState({
          start: pixelColHints.length,
          end: 0,
        });
      } else {
        satisfiedHints[colChange + height].setState({
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
          if (pixelStates[i][mouseDownCol].state !== mouseState) {
            allMouseState = false;
            break;
          }
        }
        for (let i = minRow; i < maxRow + 1; i++) {
          setTimeout(() => {
            if (
              !(
                mouseState === PixelState.SHADED &&
                pixelStates[i][mouseDownCol].state === PixelState.UNSHADED
              ) &&
              !(
                mouseState === PixelState.UNSHADED &&
                pixelStates[i][mouseDownCol].state === PixelState.SHADED
              ) &&
              (allMouseState ||
                pixelStates[i][mouseDownCol].state != mouseState)
            ) {
              pixelRefs[i][mouseDownCol].current!.click();
            }
          });
        }
      }
      if (mouseDownRow === mouseUpRow) {
        const minCol = Math.min(mouseDownCol, mouseUpCol);
        const maxCol = Math.max(mouseDownCol, mouseUpCol);
        let allMouseState = true;
        for (let i = minCol; i < maxCol + 1; i++) {
          if (pixelStates[mouseDownRow][i].state !== mouseState) {
            allMouseState = false;
            break;
          }
        }
        for (let i = minCol; i < maxCol + 1; i++) {
          setTimeout(() => {
            if (
              !(
                mouseState === PixelState.SHADED &&
                pixelStates[mouseDownRow][i].state === PixelState.UNSHADED
              ) &&
              !(
                mouseState === PixelState.UNSHADED &&
                pixelStates[mouseDownRow][i].state === PixelState.SHADED
              ) &&
              (allMouseState ||
                pixelStates[mouseDownRow][i].state !== mouseState)
            ) {
              pixelRefs[mouseDownRow][i].current!.click();
            }
          });
        }
      }
    }
    setMouseDownCol(-1);
    setMouseDownRow(-1);
    setMouseUpCol(-1);
    setMouseUpRow(-1);
  }, [mouseUpCol, mouseUpRow]);

  useEffect(() => {
    checkRowAndCol(stateRowChange, stateColChange);
  }, [stateRowChange, stateColChange]);

  // Construct initial pixel state
  for (let i = 0; i < height; i++) {
    let pixelRow = [];
    let pixelRefRow = [];
    for (let j = 0; j < width; j++) {
      const [pixelState, setPixelState] = useState(PixelState.UNKNOWN);
      pixelRow.push({
        state: pixelState,
        setState: setPixelState,
      });
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
        startHintsSatisfied={satisfiedHints[height + j].state.start}
        endHintsSatisfied={satisfiedHints[height + j].state.end}
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
        startHintsSatisfied={satisfiedHints[i].state.start}
        endHintsSatisfied={satisfiedHints[i].state.end}
        isColHint={false}
        classname={`w-64 text-right noHover`}
        longestColHintLen={longestColHintLen}
      ></Hints>
    );
    for (let j = 0; j < width; j++) {
      // Pixels
      pixelRow.push(
        <Pixel
          ref={pixelRefs[i][j]}
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
          stateValue={PixelState.SHADED}
          setMouseState={setMouseState}
        />
        <StatePixel
          currState={mouseState}
          stateValue={PixelState.UNSHADED}
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
