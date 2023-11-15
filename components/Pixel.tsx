import { State } from "@/types/Board";
import { PixelState } from "@/utils/constants";
import { forwardRef } from "react";

export type PixelTypes = {
  stateControls: State<PixelState>;
  setStateRowChange: any;
  row: number;
  setStateColChange: any;
  col: number;
  mouseState: PixelState;
  mouseDownRow: number;
  mouseDownCol: number;
  setMouseDownRow: any;
  setMouseDownCol: any;
  setMouseUpRow: any;
  setMouseUpCol: any;
};

const Pixel = forwardRef<HTMLDivElement,PixelTypes>(({
  stateControls,
  setStateRowChange,
  row,
  setStateColChange,
  col,
  mouseState,
  setMouseDownRow,
  setMouseDownCol,
  setMouseUpRow,
  setMouseUpCol,
}, ref) => {
  let state = stateControls.state;
  let setState = stateControls.setState;

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
    if (state === PixelState.UNKNOWN) {
      setState(mouseState);
    } else {
      setState(PixelState.UNKNOWN);
    }
    setStateColChange(col);
    setStateRowChange(row);
  };

  return (
    <div
      ref={ref}
      className={`${state} m-1 pointer`}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {state === PixelState.UNSHADED ? (
        <div className="ml-[0.275rem] noHover">&#10060;</div>
      ) : (
        <></>
      )}
    </div>
  );
});

Pixel.displayName = "Pixel";

export default Pixel;
