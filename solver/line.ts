import { PixelState } from "@/utils/constants";
import _ from "lodash";

export const getCurrLineHints = (
  line: string[],
  checkUnknowns: boolean
): string[] => {
  const currLineHints = [];
  let currShadedRun = 0;

  for (const state of line) {
    // If unknown and not checking if the line is completed
    // stop immediately, rest of line is disconnected
    if (checkUnknowns && state === PixelState.UNKNOWN) {
      break;
    }
    // Add to current shaded run
    else if (state === PixelState.SHADED) {
      currShadedRun += 1;
    } else {
      // Non-shaded cell following shaded run
      if (currShadedRun > 0) {
        currLineHints.push(currShadedRun.toString());
        currShadedRun = 0;
      }
    }
  }

  // Add current run if we reach the end
  if (currShadedRun > 0) {
    currLineHints.push(currShadedRun.toString());
  }

  return currLineHints;
};

export const numHintsSatisfied = (
  hints: string[],
  line: string[],
  isFromStart: boolean
): number => {
  // Reverse arrays if checking from the end of the line
  const hintsArr = isFromStart ? hints : hints.slice().reverse();
  const lineArray = isFromStart ? line : line.slice().reverse();
  const currHintArray = getCurrLineHints(lineArray, true);
  for (let i = 0; i < currHintArray.length; i++) {
    if (currHintArray[i] !== hintsArr[i]) {
      return i;
    }
  }
  return currHintArray.length;
};

export const isLineComplete = (hints: string[], line: string[]): boolean => {
  // Idea is to construct the current line's hint array
  // and check if it's equal to the given hints
  return _.isEqual(hints, getCurrLineHints(line, false));
};
