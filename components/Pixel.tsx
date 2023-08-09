export type PixelTypes = {
  stateControls: any;
};

const Pixel: React.FC<PixelTypes> = ({ stateControls }) => {
  let [state, setState] = stateControls;

  const handleClick = () => {
    if (state === "unknown") {
      setState("shaded");
    } else if (state === "shaded") {
      setState("unshaded");
    } else {
      setState("unknown");
    }
  };

  return (
    <div className={`${stateControls[0]} m-1`} onClick={handleClick}>
      {state === "unshaded" ? <div className="ml-[0.275rem] noHover">&#10060;</div> : <></>}
    </div>
  );
};

export default Pixel;
