import _ from "lodash";

export const isLineComplete = (hints: string[], line: string[]): boolean => {
  // Idea is to construct a new hint based on the current line state
  // and check to see if it's the same as that line's hints
  console.log(`real ${hints}`)
  const currLineHints = [];
  let currShadedRun = 0;
  for (const state of line) {
    // Add to current shaded run
    if (state === 'shaded') {
      currShadedRun += 1;
    }
    else {
      // Non-shaded cell following shaded run
      if (currShadedRun > 0) {
        currLineHints.push(currShadedRun.toString());
        currShadedRun = 0
      }
    }
  }
  
  // Add current run if we reach the end
  if (currShadedRun > 0) {
    currLineHints.push(currShadedRun.toString());
  }

  return _.isEqual(currLineHints, hints)
};


