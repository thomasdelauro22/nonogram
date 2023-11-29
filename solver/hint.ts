import { Hint, HintState, State } from "@/types/Board";
import { OverlapTracker } from "@/types/Solver";
import { PixelState } from "@/utils/constants";
import _ from "lodash";

const constructExtremeLine = (
  pixelLine: State<PixelState>[],
  lineHints: string[],
  satisfiedLineHints: State<HintState>,
  lineLength: number,
  isFromStart: boolean
): OverlapTracker[] => {
  let index = 0;
  let hintNum = 0;
  let skipWrap = false;
  const compactLine: OverlapTracker[] = [];
  // Keep going while we have a hint left
  while (
    hintNum <
    lineHints.length -
      (isFromStart
        ? satisfiedLineHints.state.end
        : satisfiedLineHints.state.start)
  ) {
    skipWrap = false;
    const hintLength = parseInt(lineHints[hintNum]);
    for (let j = 0; j < hintLength; j++) {
      const pixel = pixelLine[index];

      if (index >= pixelLine.length) {
        break;
      }
      if (pixel.state !== PixelState.UNSHADED) {
        compactLine.push({ state: PixelState.SHADED, hintNum: hintNum });
      } else {
        // We haven't finished the hint yet
        // Remove all shaded pixels added
        // And replace with unshaded
        compactLine.splice(compactLine.length - j, j);
        for (let k = 0; k < j + 1; k++) {
          compactLine.push({ state: PixelState.UNSHADED });
        }
        // Skip indexing curr hint and break
        skipWrap = true;
        break;
      }
      index++;
    }
    if (!skipWrap) {
      if (compactLine.length < lineLength) {
        compactLine.push({ state: PixelState.UNSHADED });
      }
      hintNum++;
    }
    index++;
  }
  console.log(
    `pixelLine: ${pixelLine.map(
      (x) => x.state
    )}, lineHints: ${lineHints} compactLine: ${compactLine.map((x) => x.state)}`
  );
  return compactLine;
};

const calculateLineOverlap = (
  pixelLine: State<PixelState>[],
  lineHints: string[],
  satisfiedLineHints: State<HintState>,
  lineLength: number,
  isRow: boolean,
  lineNum: number,
  answers: Hint[]
): void => {
  const lowExtremeLine = constructExtremeLine(
    pixelLine,
    lineHints,
    satisfiedLineHints,
    lineLength,
    true
  );
  const highExtremeLine = constructExtremeLine(
    pixelLine.slice().reverse(),
    lineHints.slice().reverse(),
    satisfiedLineHints,
    lineLength,
    false
  )
    .slice()
    .reverse();

  while (lowExtremeLine.length < lineLength) {
    lowExtremeLine.push({ state: PixelState.UNSHADED });
  }
  while (highExtremeLine.length < lineLength) {
    highExtremeLine.unshift({ state: PixelState.UNSHADED });
  }
  console.log(
    `lowExtremeLine: ${lowExtremeLine.map(
      (x) => `${x.state}, ${x.hintNum}`
    )} highExtremeLine: ${highExtremeLine.map(
      (x) => `${x.state}, ${x.hintNum}`
    )}`
  );

  for (let pixel = 0; pixel < lowExtremeLine.length; pixel++) {
    const lowPixel = lowExtremeLine[pixel];
    const highPixel = highExtremeLine[pixel];
    if (
      lowPixel.state === PixelState.SHADED &&
      highPixel.state === PixelState.SHADED &&
      highPixel.hintNum !== undefined &&
      lowPixel.hintNum === lineHints.length - highPixel.hintNum - 1 &&
      pixelLine[pixel].state !== PixelState.SHADED
    ) {
      console.log(
        `${JSON.stringify({
          row: isRow ? lineNum : pixel,
          col: isRow ? pixel : lineNum,
          state: PixelState.SHADED,
        })}, pixelLine: ${pixelLine.map(
          (x) => x.state
        )}, lineHints: ${lineHints}`
      );
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
  let lastWallIndex = 0; // Index last wall occurs before
  let shadedRunLength = 0;
  let shadedRunStart = 0;
  let i = 0;
  let prevShaded = false;

  while (i < pixelLine.length && currHintIndex < lineHints.length) {
    const currHint = parseInt(lineHints[currHintIndex]);
    let pixelState = pixelLine[i].state;
    // According to current state, this is the start of the shaded region for the current hint
    if (pixelState === PixelState.SHADED && !prevShaded) {
      prevShaded = true;
      shadedRunLength = 1;
      shadedRunStart = i;
      // The run continues
    } else if (pixelState === PixelState.SHADED && prevShaded) {
      shadedRunLength++;
      // Run ends, keep shading if not far enough from the wall
      // according to the current hint
    } else if (pixelState !== PixelState.SHADED && prevShaded) {
      // Hint is satisfied, check if we can mark pixel 1 to the start as UNSHADED
      if (
        shadedRunLength === currHint &&
        shadedRunStart > 0 &&
        pixelLine[shadedRunStart - 1].state === PixelState.UNKNOWN &&
        lastWallIndex + currHint === i - 1
      ) {
        console.log("aaaaa");
        console.log(lineNum, isFromStart, shadedRunLength, shadedRunStart);
        answers.push({
          row: isRow
            ? lineNum
            : isFromStart
            ? shadedRunStart - 1
            : pixelLine.length - (shadedRunStart - 1) - 1,
          col: isRow
            ? isFromStart
              ? shadedRunStart - 1
              : pixelLine.length - (shadedRunStart - 1) - 1
            : lineNum,
          state: PixelState.UNSHADED,
        });
      }
      prevShaded = false;
      shadedRunLength = 0;
      currHintIndex++;
      while (i < lastWallIndex + currHint) {
        pixelState = pixelLine[i].state;
        if (pixelState !== PixelState.SHADED) {
          answers.push({
            row: isRow ? lineNum : isFromStart ? i : pixelLine.length - i - 1,
            col: isRow ? (isFromStart ? i : pixelLine.length - i - 1) : lineNum,
            state: PixelState.SHADED,
          });
        }
        i++;
      }
      // Keep going until we find a new start wall or we reach the end
      while (
        i < pixelLine.length &&
        pixelLine[i].state !== PixelState.UNSHADED
      ) {
        i++;
      }
      lastWallIndex = i + 1;
      // Hint couldn't fit in prev space. Mark this as the new wall
      // and fill all cells in small space as UNSHADED
    } else if (
      pixelState === PixelState.UNSHADED &&
      !prevShaded &&
      currHint >= i - lastWallIndex + 1
    ) {
      for (let j = 0; j < i - lastWallIndex; j++) {
        let pixelState = pixelLine[lastWallIndex + j].state;
        if (pixelState === PixelState.UNKNOWN) {
          console.log("bbbbb");
          answers.push({
            row: isRow
              ? lineNum
              : isFromStart
              ? lastWallIndex + j
              : pixelLine.length - (lastWallIndex + j) - 1,
            col: isRow
              ? isFromStart
                ? lastWallIndex + j
                : pixelLine.length - (lastWallIndex + j) - 1
              : lineNum,
            state: PixelState.UNSHADED,
          });
        }
      }
      lastWallIndex = i + 1;
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
        : satisfiedLineHints.state.end) &&
    index < pixelLine.length
  ) {
    const pixel = pixelLine[index];
    if (pixel.state === PixelState.SHADED && !inShadedRun) {
      inShadedRun = true;
    }
    // This is 1 to the end of satisfied hint
    else if (pixel.state !== PixelState.SHADED && inShadedRun) {
      if (pixel.state === PixelState.UNKNOWN) {
        console.log("ccccc");
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
    const pixelRow = pixelStates[i];
    const rowSatisfiedHints = satisfiedHints[i];
    calculateLineOverlap(
      pixelRow,
      rowHints,
      rowSatisfiedHints,
      rowLength,
      true,
      i,
      answers
    );
  }

  // Iternate through each column
  for (let i = 0; i < pixelStates[0].length; i++) {
    const colHints = hints[pixelStates.length + i];
    const pixelCol = [];
    const colSatisfiedHints = satisfiedHints[pixelStates.length + i];
    for (let j = 0; j < pixelStates.length; j++) {
      pixelCol.push(pixelStates[j][i]);
    }
    calculateLineOverlap(
      pixelCol,
      colHints,
      colSatisfiedHints,
      colLength,
      false,
      i,
      answers
    );
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
    calculateExtends(pixelCol, colHints, false, true, i, answers);
    calculateExtends(
      pixelCol.slice().reverse(),
      colHints.slice().reverse(),
      false,
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
