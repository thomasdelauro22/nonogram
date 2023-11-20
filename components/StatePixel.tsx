import { PixelState } from "@/utils/constants";
import { forwardRef } from "react";

export type StatePixelTypes = {
  stateValue: PixelState;
  setMouseState: any;
  currState: PixelState;
};

const StatePixel = forwardRef<HTMLDivElement,StatePixelTypes>(({
  stateValue,
  setMouseState,
  currState,
}, ref) => {
  const handleClick = () => {
    console.log('clicked');
    setMouseState(stateValue);
  };

  const hasBorder = currState === stateValue;

  return (
    <div
      ref={ref}
      className={`${
        hasBorder ? "border-2 border-yellow-300" : ""
      } ${stateValue} m-1 pointer`}
      onClick={handleClick}
    >
      {stateValue === PixelState.UNSHADED ? (
        <div
          className={`${
            hasBorder ? "ml-[0.15rem] -mt-[0.1rem]" : "ml-[0.275rem]"
          } noHover`}
        >
          &#10060;
        </div>
      ) : (
        <></>
      )}
    </div>
  );
});

export default StatePixel;
