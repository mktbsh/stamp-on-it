export type State =
  | {
      seen: "initial";
    }
  | {
      seen: "crop";
      original: Blob;
    }
  | {
      seen: "binarized";
      original: Blob;
      processed: Blob;
      croppedAreaPixels: {
        width: number;
        height: number;
        x: number;
        y: number;
      };
    };
