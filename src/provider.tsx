import { DispatcherContext, StateContext } from "./context";
import { useAsyncReducer } from "./async-reducer";
import { reducer } from "./reducer";

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, asyncDispatch] = useAsyncReducer(reducer, {
    seen: "initial",
  });

  return (
    <DispatcherContext.Provider value={asyncDispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatcherContext.Provider>
  );
}
