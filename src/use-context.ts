import { useContext } from "react";
import { DispatcherContext, StateContext } from "./context";

export function useStateCtx() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatcherContext);

  if (state === undefined || dispatch === undefined) {
    throw new Error("useStateCtx must be used within a StateProvider");
  }

  return {
    state,
    dispatch,
  };
}
