import _ from "lodash";

export interface HintProps {
  lineHints: string[];
  startHintsSatisfied: number;
  endHintsSatisfied: number;
  isColHint: boolean;
  classname?: string;
  longestColHintLen: number; // for column hints
}

const Hints: React.FC<HintProps> = ({
  lineHints,
  startHintsSatisfied,
  endHintsSatisfied,
  isColHint,
  classname,
  longestColHintLen,
}) => {
  let hintsArr: any[] = [];
  const delimiter = isColHint ? "\n" : " ";
  for (let i = 0; i < lineHints.length; i++) {
    const hint = lineHints[i];
    const isSatified =
      i < startHintsSatisfied || i >= lineHints.length - endHintsSatisfied;
    hintsArr.push(
      <span className={`${isSatified ? "text-gray-200" : "text-green-500"}`}>{`${
        hint + delimiter
      }`}</span>
    );
  }

  if (isColHint) {
    while (hintsArr.length < longestColHintLen) {
      hintsArr = _.concat(<span>{" \n"}</span>, hintsArr);
    }
  }
  return (
    <div className={classname} id="hint">
      <p>{hintsArr}</p>
    </div>
  );
};

export default Hints;
