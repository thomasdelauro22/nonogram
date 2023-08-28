import { useEffect, useState } from "react";
import Hints from "./Hints";
import Pixel from "./Pixel";
import {
  isLineComplete,
  numEndHintsSatisfied,
  numStartHintsSatisfied,
} from "@/solver/line";
import StatePixel from "./StatePixel";

export type GameboardTypes = {
  width: number;
  height: number;
  hints: string[][]; // given [rowHints, colHints]
};

const Gameboard: React.FC<GameboardTypes> = ({ width, height, hints }) => {
  let pixelArray: JSX.Element[][] = [];
  let pixelStates: any[][] = [];

  // Pixels set this value each time they change
  // so we can check the completion status of the line
  const [stateRowChange, setStateRowChange] = useState(-1);
  const [stateColChange, setStateColChange] = useState(-1);

  // Controls what state the pixels are set to when clicked
  const [mouseState, setMouseState] = useState("shaded");

  // Keeps track of which hints are satisfied
  let satisfiedHints: any[] = [];
  for (let i = 0; i < hints.length; i++) {
    const [lineHintsSatisfied, setLineHintsSatsisfied] = useState({
      start: 0,
      end: 0,
    });
    satisfiedHints.push([lineHintsSatisfied, setLineHintsSatsisfied]);
  }

  useEffect(() => {
    if (stateRowChange !== -1 && stateColChange !== -1) {
      // Check if newly changed row is satisfied
      const pixelRow = pixelStates[stateRowChange];
      const pixelRowStates = pixelRow.map((x) => x[0]);
      const pixelRowStateControls = pixelRow.map((x) => x[1]);
      const pixelRowHints = hints[stateRowChange];
      if (isLineComplete(pixelRowHints, pixelRowStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelRow.length; i++) {
          if (pixelRowStates[i] === "unknown") {
            pixelRowStateControls[i]("unshaded");
          }
        }
        satisfiedHints[stateRowChange][1]({
          start: pixelRowHints.length,
          end: 0,
        });
      } else {
        // Update row's completed hints
        satisfiedHints[stateRowChange][1]({
          start: numStartHintsSatisfied(pixelRowHints, pixelRowStates),
          end: numEndHintsSatisfied(pixelRowHints, pixelRowStates),
        });
      }
      let pixelColStates = [];
      let pixelColStateControls = [];
      const pixelColHints = hints[height + stateColChange];
      for (let i = 0; i < height; i++) {
        pixelColStates.push(pixelStates[i][stateColChange][0]);
        pixelColStateControls.push(pixelStates[i][stateColChange][1]);
      }
      // Check if newly changed col is satisfied
      if (isLineComplete(pixelColHints, pixelColStates)) {
        // Set all unknown cells to unshaded
        for (let i = 0; i < pixelColStates.length; i++) {
          if (pixelColStates[i] === "unknown") {
            pixelColStateControls[i]("unshaded");
          }
        }
        satisfiedHints[stateColChange + height][1]({
          start: pixelColHints.length,
          end: 0,
        });
      } else {
        // Update col's completed hints
        satisfiedHints[stateColChange + height][1]({
          start: numStartHintsSatisfied(pixelColHints, pixelColStates),
          end: numEndHintsSatisfied(pixelColHints, pixelColStates),
        });
      }
      setStateColChange(-1);
      setStateRowChange(-1);
    }
  }, [stateRowChange, stateColChange]);

  // Construct initial pixel state
  for (let i = 0; i < height; i++) {
    let pixelRow = [];
    for (let j = 0; j < width; j++) {
      const [pixelState, setPixelState] = useState("unknown");
      pixelRow.push([pixelState, setPixelState]);
    }
    pixelStates.push(pixelRow);
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
          stateControls={pixelStates[i][j]}
          setStateRowChange={setStateRowChange}
          setStateColChange={setStateColChange}
          row={i}
          col={j}
          mouseState={mouseState}
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
        ></StatePixel>
        <StatePixel
          currState={mouseState}
          stateValue="unshaded"
          setMouseState={setMouseState}
        ></StatePixel>
      </div>
    </>
  );
};

export default Gameboard;
