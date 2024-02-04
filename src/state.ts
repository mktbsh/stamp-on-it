export type State =
  | {
      seen: "initial";
    }
  | {
      seen: "crop";
      original: File;
    }
  | {
      seen: "binarized";
      original: File;
      processed: Blob;
      croppedAreaPixels: {
        width: number;
        height: number;
        x: number;
        y: number;
      };
    };
