export interface HintProps {
  lineHints: string[];
  isColHint: boolean;
  classname?: string;
  longestColHintLen: number; // for column hints
}

const Hints: React.FC<HintProps> = ({
  lineHints,
  isColHint,
  classname,
  longestColHintLen,
}) => {
  let hintsStr: string = "";
  const delimiter = isColHint ? "\n" : " ";
  for (let hint of lineHints) {
    hintsStr = hintsStr.concat(hint + delimiter);
  }

  if (isColHint) {
    while (hintsStr.length < 2 * longestColHintLen) {
      hintsStr = " \n" + hintsStr;
    }
  }
  return (
    <div className={classname} id="hint">
      {hintsStr}
    </div>
  );
};

export default Hints;
