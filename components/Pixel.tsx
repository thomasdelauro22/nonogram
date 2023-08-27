export type PixelTypes = {
  stateControls: any;
  setStateRowChange: any;
  row: number;
  setStateColChange: any;
  col: number;
};

const Pixel: React.FC<PixelTypes> = ({
  stateControls,
  setStateRowChange,
  row,
  setStateColChange,
  col,
}) => {
  let [state, setState] = stateControls;

  const handleClick = () => {
    if (state === "unknown") {
      setState("shaded");
    } else if (state === "shaded") {
      setState("unshaded");
    } else {
      setState("unknown");
    }
    setStateColChange(col);
    setStateRowChange(row);
  };

  return (
    <div className={`${stateControls[0]} m-1`} onClick={handleClick}>
      {state === "unshaded" ? (
        <div className="ml-[0.275rem] noHover">&#10060;</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Pixel;
