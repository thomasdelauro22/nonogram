export interface HintProps {
    lineHints: string[];
    isColHint: boolean;
    classname?: string;
}

const Hints: React.FC<HintProps> = ({lineHints, isColHint, classname}) => {
    let hintsStr: String = '';
    const delimiter = isColHint ? '\n' : ' '
    for (let hint of lineHints) {
        hintsStr = hintsStr.concat(hint + delimiter);
    }
    console.log(hintsStr)
    return <div className={classname} id="hint">{hintsStr}</div>
  };

export default Hints;