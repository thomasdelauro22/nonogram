import Pixel from "./Pixel";

export type GameboardTypes = {
  width: number;
  height: number;
};

const Gameboard: React.FC<GameboardTypes> = ({ width, height }) => {
  let pixelArray: JSX.Element[][] = [];
  for (let i = 0; i < height; i++) {
    let pixelRow: JSX.Element[] = [];
    for (let j = 0; j < width; j++) {
      pixelRow.push(<Pixel isKnown={false} isShaded={true}></Pixel>);
    }
    pixelArray.push([<div className="flex">{pixelRow}</div>]);
  }
  return <>{pixelArray}</>;
};

export default Gameboard;
