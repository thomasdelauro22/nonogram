import { Dispatch, SetStateAction } from "react";

export type State<T> = {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
};
