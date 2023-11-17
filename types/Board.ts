import { PixelState } from "@/utils/constants";
import { Dispatch, SetStateAction } from "react";

export type State<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
};

export type HintState = {
  start: number;
  end: number;
};

export type Hint = {
  row: number;
  col: number;
  state: PixelState;
};
