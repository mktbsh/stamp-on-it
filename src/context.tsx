import { createContext } from "react";
import { DispatcherAction } from "./reducer";
import { State } from "./state";

export const DispatcherContext = createContext<DispatcherAction | undefined>(
  undefined
);

export const StateContext = createContext<State | undefined>({
  seen: "initial",
});
