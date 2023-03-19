export type GameboardTypes = {
  width: number;
  height: number;
};

const Gameboard: React.FC<GameboardTypes> = ({ width, height }) => {
  let pixelArray: JSX.Element[][] = [];
  for (let i = 0; i < width; i++) {
    pixelArray.push([]);
    for (let j = 0; j < height; j++) {
      pixelArray[i].push(<p>{i + j}</p>);
    }
  }
  return <>{pixelArray}</>;
};

export default Gameboard;
