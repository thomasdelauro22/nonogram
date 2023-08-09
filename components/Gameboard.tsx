import { useState } from "react";
import Hints from "./Hints";
import Pixel from "./Pixel";

export type GameboardTypes = {
  width: number;
  height: number;
  hints: string[][]; // given [rowHints, colHints]
};

const Gameboard: React.FC<GameboardTypes> = ({ width, height, hints }) => {
  let pixelArray: JSX.Element[][] = [];
  let pixelStates: any[][] = [];

  // Construct initial pixel state
  for (let i = 0; i < height; i++) {
    let pixelRow = [];
    for (let j = 0; j < width; j++) {
      const [pixelState, setPixelState] = useState('unknown');
      pixelRow.push([pixelState, setPixelState])
    }
    pixelStates.push(pixelRow);
  } 

  // Find longest length hint for styling
  let longestColHintLen = 0;
  for (let j = 0; j < width; j++) {
    if (hints[height+j].length > longestColHintLen) {
      longestColHintLen = hints[height+j].length;
    }
  }

  // Place col hints
  let colHints: JSX.Element[] = [];
  for (let j = 0; j < width; j++) {
    colHints.push(
      <Hints
        lineHints={hints[height + j]}
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
    pixelRow.push(
      <Hints
        lineHints={hints[i]}
        isColHint={false}
        classname={`w-64 text-right noHover`}
        longestColHintLen={longestColHintLen}
      ></Hints>
    );
    for (let j = 0; j < width; j++) {
      if (i === 0) {
        pixelRow.push(
          <div className="flex-col">
            <Pixel stateControls={pixelStates[i][j]}></Pixel>
          </div>
        );
      } else {
        pixelRow.push(<Pixel stateControls={pixelStates[i][j]}></Pixel>);
      }
    }
    pixelArray.push([
      <div className="flex flex-row relative justify-center -ml-64">
        {pixelRow}
      </div>,
    ]);
  }

  return <>{pixelArray}</>;
};

export default Gameboard;
