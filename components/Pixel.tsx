export type PixelTypes = {
  isKnown: boolean;
  isShaded: boolean;
};

const Pixel: React.FC<PixelTypes> = ({ isKnown, isShaded }) => {
  if (!isKnown) {
    return <div className="unknown m-4"></div>;
  } else if (isShaded) {
    return <div className="shaded m-4"></div>;
  }
  return <div className="unshaded m-4"></div>;
};

export default Pixel;
