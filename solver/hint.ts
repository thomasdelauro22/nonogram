import { Hint, HintState, State } from "@/types/Board";
import { OverlapTracker } from "@/types/Solver";
import { PixelState } from "@/utils/constants";

const calculateLineOverlap = (
  pixelStates: State<PixelState>[][],
  lineHints: string[],
  lineLength: number,
  isRow: boolean,
  lineNum: number,
  answers: Hint[]
): void => {
  const compactLine: OverlapTracker[] = [];
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

const calculateExtends = (
  pixelLine: State<PixelState>[],
  lineHints: string[],
  isRow: boolean,
  isFromStart: boolean,
  lineNum: number,
  answers: Hint[]
): void => {
  let currHintIndex = 0;
  let lastWallIndex = 0;
  let shadedRunLength = 0;
  let shadedRunStart = 0;
  let i = 0;
  let prevShaded = false;

  while (i < pixelLine.length && currHintIndex < lineHints.length) {
    const currHint = lineHints[currHintIndex];
    const pixelState = pixelLine[i].state;
    // According to current state, this is the start of the shaded region for the current hint
    if (pixelState === PixelState.SHADED && !prevShaded) {
      prevShaded = true;
      shadedRunLength++;
      shadedRunStart = i;
      // The run continues
    } else if (pixelState === PixelState.SHADED && prevShaded) {
      shadedRunLength++;
      // Run ends, keep shading if not far enough from the wall
      // according to the current hint
    } else if (pixelState !== PixelState.SHADED && prevShaded) {
      prevShaded = false;
      currHintIndex++;
      while (i < lastWallIndex + parseInt(currHint)) {
        answers.push({
          row: isRow ? lineNum : isFromStart ? i : pixelLine.length - i - 1,
          col: isRow ? (isFromStart ? i : pixelLine.length - i - 1) : lineNum,
          state: PixelState.SHADED,
        });
        i++;
      }
      // Keep going until we find a new left wall or we reach the end
      while (
        i < pixelLine.length &&
        pixelLine[i].state !== PixelState.UNSHADED
      ) {
        i++;
      }
      lastWallIndex = i;
    }
    i++;
  }
};

const wrapSatisfiedHints = (
  satisfiedLineHints: State<HintState>,
  pixelLine: State<PixelState>[],
  answers: Hint[],
  isRow: boolean,
  lineNum: number,
  isFromStart: boolean
) => {
  let satisfiedHintNum = 0;
  let index = 0;
  let inShadedRun = false;
  while (
    satisfiedHintNum <
    (isFromStart
      ? satisfiedLineHints.state.start
      : satisfiedLineHints.state.end)
  ) {
    const pixel = pixelLine[index];
    if (pixel.state === PixelState.SHADED && !inShadedRun) {
      inShadedRun = true;
    }
    // This is 1 to the end of satisfied hint
    else if (pixel.state !== PixelState.SHADED && inShadedRun) {
      if (pixel.state === PixelState.UNKNOWN) {
        answers.push({
          row: isRow
            ? lineNum
            : isFromStart
            ? index
            : pixelLine.length - index - 1,
          col: isRow
            ? isFromStart
              ? index
              : pixelLine.length - index - 1
            : lineNum,
          state: PixelState.UNSHADED,
        });
      }
      inShadedRun = false;
      satisfiedHintNum++;
    }
    index++;
  }
};

export const calculateHint = (
  pixelStates: State<PixelState>[][],
  hints: string[][],
  satisfiedHints: State<HintState>[]
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

  // Iternate through each column
  for (let i = 0; i < pixelStates[0].length; i++) {
    const colHints = hints[pixelStates.length + i];
    calculateLineOverlap(pixelStates, colHints, colLength, false, i, answers);
  }

  // Check if a shaded region needs to extend from a wall
  for (let i = 0; i < pixelStates.length; i++) {
    const rowHints = hints[i];
    const pixelRow = pixelStates[i];
    calculateExtends(pixelRow, rowHints, true, true, i, answers);
    calculateExtends(
      pixelRow.slice().reverse(),
      rowHints.slice().reverse(),
      true,
      false,
      i,
      answers
    );
  }

  for (let i = 0; i < pixelStates[0].length; i++) {
    const colHints = hints[pixelStates[0].length + i];
    const pixelCol = [];
    for (let j = 0; j < pixelStates.length; j++) {
      pixelCol.push(pixelStates[j][i]);
    }
    calculateExtends(pixelCol, colHints, true, true, i, answers);
    calculateExtends(
      pixelCol.slice().reverse(),
      colHints.slice().reverse(),
      true,
      false,
      i,
      answers
    );
  }

  // Check is any satisfied hints can be wrapped
  for (let i = 0; i < pixelStates.length; i++) {
    const pixelRow = pixelStates[i];
    const rowSatisfiedHints = satisfiedHints[i];
    wrapSatisfiedHints(rowSatisfiedHints, pixelRow, answers, true, i, true);
    wrapSatisfiedHints(
      rowSatisfiedHints,
      pixelRow.slice().reverse(),
      answers,
      true,
      i,
      false
    );
  }

  for (let i = 0; i < pixelStates[0].length; i++) {
    const pixelCol = [];
    for (let j = 0; j < pixelStates.length; j++) {
      pixelCol.push(pixelStates[j][i]);
    }
    const colSatisfiedHints = satisfiedHints[pixelStates.length + i];
    wrapSatisfiedHints(colSatisfiedHints, pixelCol, answers, false, i, true);
    wrapSatisfiedHints(
      colSatisfiedHints,
      pixelCol.slice().reverse(),
      answers,
      false,
      i,
      false
    );
  }

  return answers.length ? answers[0] : null;
};
