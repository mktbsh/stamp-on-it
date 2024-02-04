import { Dispatch, Reducer, useCallback, useReducer } from "react";
import { State } from "./state";
import { DispatcherAction, ReducerAction } from "./reducer";

function asyncDispatcher<T>(dispatch: Dispatch<T>) {
    return async (action: T | ((dispatch: Dispatch<T>) => Promise<void>)) => {
      if (typeof action === "function") {
        await (action as (dispatch: Dispatch<T>) => Promise<void>)(dispatch);
      } else {
        dispatch(action);
      }
    };
  }
  
  export const useAsyncReducer = (
    reducer: Reducer<State, ReducerAction>,
    initialState: State
  ): [State, DispatcherAction] => {
    const [state, setState] = useReducer(reducer, initialState);
  
    const asyncDispatch = useCallback(asyncDispatcher<ReducerAction>(setState), [
      setState,
    ]);
  
    return [state, asyncDispatch];
  };
  