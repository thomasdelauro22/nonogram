export type PixelTypes = {
  stateControls: any;
  setStateRowChange: any;
  row: number;
  setStateColChange: any;
  col: number;
  mouseState: string;
};

const Pixel: React.FC<PixelTypes> = ({
  stateControls,
  setStateRowChange,
  row,
  setStateColChange,
  col,
  mouseState,
}) => {
  let [state, setState] = stateControls;

  const handleClick = () => {
    // Change directly to the mouse state
    // Otherwise, make it unknown
    if (state !== mouseState) {
      setState(mouseState);
    }
    else {
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
