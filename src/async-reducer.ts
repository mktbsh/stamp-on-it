import { Dispatch, Reducer, useCallback, useReducer } from "react";
import { State } from "./state";
import { DispatcherAction, ReducerAction } from "./reducer";

function useAsyncDispatcher<T>(dispatch: Dispatch<T>) {
  return useCallback(async (action: T | ((dispatch: Dispatch<T>) => Promise<void>)) => {
    if (typeof action === "function") {
      await (action as (dispatch: Dispatch<T>) => Promise<void>)(dispatch);
    } else {
      dispatch(action);
    }
  }, [dispatch]);
}

export const useAsyncReducer = (
  reducer: Reducer<State, ReducerAction>,
  initialState: State
): [State, DispatcherAction] => {
  const [state, setState] = useReducer(reducer, initialState);

  const asyncDispatch = useAsyncDispatcher<ReducerAction>(setState);

  return [state, asyncDispatch];
};
