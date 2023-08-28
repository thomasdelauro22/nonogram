export type StatePixelTypes = {
  stateValue: string;
  setMouseState: any;
  currState: string;
};

const Pixel: React.FC<StatePixelTypes> = ({
  stateValue,
  setMouseState,
  currState,
}) => {
  const handleClick = () => {
    setMouseState(stateValue);
  };

  const hasBorder = currState === stateValue;

  return (
    <div
      className={`${
        hasBorder ? "border-2 border-yellow-300" : ""
      } ${stateValue} m-1`}
      onClick={handleClick}
    >
      {stateValue === "unshaded" ? (
        <div className={`${hasBorder ? "ml-[0.15rem] -mt-[0.1rem]" : "ml-[0.275rem]"} noHover`}>&#10060;</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Pixel;
