import {
  Box,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { PositiveButton, ResetButton } from "./_components/buttons";

type Props = {
  file: Blob;
};

type State = {
  filename: string;
  image: string;
};

export function BinarizedImage({ file }: Props) {
  const [state, setState] = useState<State>({ filename: "", image: "" });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const revoke = (v: string) => URL.revokeObjectURL(v);

    const url = URL.createObjectURL(file);

    setState((prev) => {
      prev.image && revoke(prev.image);

      return {
        filename: window.crypto.randomUUID(),
        image: url,
      };
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!state.image) return null;

  function handleDownload() {
    const filename = inputRef.current?.value || state.filename;

    const a = document.createElement("a");
    a.href = state.image;
    a.download = `${filename}.png`;
    a.click();
    a.remove();
  }

  return (
    <Stack spacing="6">
      <Stack spacing="6" align="center">
        <Stack spacing="3" textAlign="center">
          <Heading size="xs">Stamp liked image</Heading>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="4" maxW="full">
          <Box h="300px" w="full">
            <Image
              src={state.image}
              alt=""
              w="auto"
              h="full"
              mx="auto"
              objectFit="cover"
            />
          </Box>
          <InputGroup>
            <Input ref={inputRef} type="text" placeholder={state.filename} />
            <InputRightAddon>.png</InputRightAddon>
          </InputGroup>
        </Stack>
      </Stack>

      <Flex w="full" justifyContent="center" gap="4">
        <ResetButton />
        <PositiveButton text="Download" onClick={handleDownload} />
      </Flex>
    </Stack>
  );
}
