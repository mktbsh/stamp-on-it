import { Dispatch } from "react";
import { State } from "./state";

export type ReducerAction =
  | {
      type: "input";
      payload: File;
    }
  | {
      type: "crop";
      payload: {
        cropped: Blob;
        area: {
          width: number;
          height: number;
          x: number;
          y: number;
        };
      };
    }
  | {
      type: "reset";
    };

export type DispatcherAction = (
  action: ReducerAction | ((dispatch: Dispatch<ReducerAction>) => Promise<void>)
) => Promise<void>;

export function reducer(state: State, action: ReducerAction): State {
  switch (action.type) {
    case "input": {
      return { seen: "crop", original: action.payload };
    }
    case "crop": {
      if (state.seen !== "crop") throw new Error("Invalid state");

      return {
        seen: "binarized",
        original: state.original,
        processed: action.payload.cropped,
        croppedAreaPixels: action.payload.area,
      };
    }
    case "reset": {
      return { seen: "initial" };
    }
  }
}
