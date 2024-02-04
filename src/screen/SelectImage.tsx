import {
    Heading,
    Stack,
    Text,
  } from "@chakra-ui/react";
import { Dropzone } from "../components/Dropzone";
import { useStateCtx } from "../use-context";
import { useCallback, type DragEventHandler, useRef, ChangeEventHandler } from "react";

export function SelectImage() {
    const { dispatch } = useStateCtx();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
        e.preventDefault();
    
        if (e.dataTransfer.items) {
          const items = Array.from(e.dataTransfer.items);
          const files = items.map((item) => {
            return item.kind === "file" ? item.getAsFile() : null;
          }).filter((file): file is File => file !== null);
          if (files.length === 0) return;
          return dispatch({ type: "input", payload: files[0]  });
        }

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        dispatch({ type: "input", payload: files[0] });
      }, [dispatch])

    const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => e.preventDefault(), [])

    const handleClickDropzone = useCallback(() => {
        inputRef.current?.click();
    }, [])

    const handleChangeInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.target.files === null) return;
        dispatch({ type: "input", payload: e.target.files[0] });
    }, [dispatch])
 
    return (
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            <Stack spacing="3" textAlign="center">
              <Heading size="xs">Select your image</Heading>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="4">
              <Dropzone onDrop={handleDrop} onDragOver={handleDragOver} onClick={handleClickDropzone} />
              <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={handleChangeInput} />
            </Stack>
          </Stack>
          <Text textStyle="sm" color="fg.muted" textAlign="center">
          Image is never sent to servers, etc.
          </Text>
        </Stack>
    )
}