export type PixelTypes = {
  stateControls: any;
  setStateRowChange: any;
  row: number;
  setStateColChange: any;
  col: number;
  mouseState: string;
  mouseDownRow: number;
  mouseDownCol: number;
  setMouseDownRow: any;
  setMouseDownCol: any;
  setMouseUpRow: any;
  setMouseUpCol: any;
};

const Pixel: React.FC<PixelTypes> = ({
  stateControls,
  setStateRowChange,
  row,
  setStateColChange,
  col,
  mouseState,
  mouseDownRow,
  mouseDownCol,
  setMouseDownRow,
  setMouseDownCol,
  setMouseUpRow,
  setMouseUpCol,
}) => {
  let [state, setState] = stateControls;

  const onMouseDown = () => {
    setMouseDownCol(col);
    setMouseDownRow(row);
  };

  const onMouseUp = () => {
    setMouseUpCol(col);
    setMouseUpRow(row);
  };

  const handleClick = () => {
    // Change directly to the mouse state if unknown
    // Otherwise, make it unknown
    if (state === "unknown") {
      setState(mouseState);
    } else {
      setState("unknown");
    }
    setStateColChange(col);
    setStateRowChange(row);
  };

  return (
    <div
      className={`${stateControls[0]} m-1`}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {state === "unshaded" ? (
        <div className="ml-[0.275rem] noHover">&#10060;</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Pixel;
