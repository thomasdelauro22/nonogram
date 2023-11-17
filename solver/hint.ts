import { Hint, State } from "@/types/Board";
import { OverlopTracker } from "@/types/Solver";
import { PixelState } from "@/utils/constants";

const calculateLineOverlap = (
  pixelStates: State<PixelState>[][],
  lineHints: string[],
  lineLength: number,
  isRow: boolean,
  lineNum: number,
  answers: Hint[]
): void => {
  const compactLine: OverlopTracker[] = [];
  for (let hintNum = 0; hintNum < lineHints.length; hintNum++) {
    for (let j = 0; j < parseInt(lineHints[hintNum]); j++) {
      compactLine.push({ state: PixelState.SHADED, hintNum: hintNum });
    }
    if (compactLine.length < lineLength && hintNum !== lineHints.length - 1) {
      compactLine.push({ state: PixelState.UNSHADED });
    }
  }
  const lowExtremeLine = compactLine.slice();
  const highExtremeLine = compactLine.slice();
  while (lowExtremeLine.length < lineLength) {
    lowExtremeLine.push({ state: PixelState.UNSHADED });
    highExtremeLine.unshift({ state: PixelState.UNSHADED });
  }
  for (let pixel = 0; pixel < lowExtremeLine.length; pixel++) {
    const lowPixel = lowExtremeLine[pixel];
    const highPixel = highExtremeLine[pixel];
    if (
      lowPixel.state === PixelState.SHADED &&
      highPixel.state === PixelState.SHADED &&
      lowPixel.hintNum === highPixel.hintNum &&
      ((isRow && pixelStates[lineNum][pixel].state !== PixelState.SHADED) ||
        (!isRow && pixelStates[pixel][lineNum].state !== PixelState.SHADED))
    ) {
      answers.push({
        row: isRow ? lineNum : pixel,
        col: isRow ? pixel : lineNum,
        state: PixelState.SHADED,
      });
    }
  }
};

export const calculateHint = (
  pixelStates: State<PixelState>[][],
  hints: string[][]
): Hint | null => {
  const rowLength = pixelStates[0].length;
  const colLength = pixelStates.length;
  const answers: Hint[] = [];

  // Check for manditory overlaps
  // Iterate through each row
  for (let i = 0; i < pixelStates.length; i++) {
    const rowHints = hints[i];
    calculateLineOverlap(pixelStates, rowHints, rowLength, true, i, answers);
  }

  //Iternate through each column
  for (let i = 0; i < pixelStates[0].length; i++) {
    const colHints = hints[pixelStates.length + i];
    calculateLineOverlap(pixelStates, colHints, colLength, false, i, answers);
  }

  return answers.length ? answers[0] : null;
};
