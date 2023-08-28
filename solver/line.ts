import _ from "lodash";

export const getCurrLineHints = (line: string[]): string[] => {
  const currLineHints = [];
  let currShadedRun = 0;
  for (const state of line) {
    // Add to current shaded run
    if (state === "shaded") {
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

export const numStartHintsSatisfied = (hints: string[], line: string[]): number => {
  const currHintArray = getCurrLineHints(line);
  for (let i = 0; i < hints.length; i++) {
    if (i >= currHintArray.length || currHintArray[i] !== hints[i]) {
      return i;
    }
  }
  return hints.length;
};

export const numEndHintsSatisfied = (hints: string[], line: string[]): number => {
  const currHintArray = getCurrLineHints(line);
  for (let i = 1; i < hints.length + 1; i++) {
    if (
      currHintArray.length - i < 0 ||
      currHintArray[currHintArray.length - i] !== hints[hints.length - i]
    ) {
      return i - 1;
    }
  }
  return hints.length;
};

export const isLineComplete = (hints: string[], line: string[]): boolean => {
  // Idea is to construct the current line's hint array
  // and check if it's equal to the given hints
  return _.isEqual(hints, getCurrLineHints(line));
};
