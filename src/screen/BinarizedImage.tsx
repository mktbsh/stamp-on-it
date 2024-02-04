import { Button, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  file: Blob;
};

export function BinarizedImage({ file }: Props) {
  const [imageSource, setImageSource] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setImageSource((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return url;
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!imageSource) return null;

  function handleDownload() {
    const a = document.createElement("a");
    a.href = imageSource;
    a.download = `${Date.now()}.jpeg`;
    a.click();
    a.remove();
  }

  return (
    <Stack spacing="8">
      <Stack spacing="6" align="center">
        <Stack spacing="3" textAlign="center">
          <Heading size="xs">Stamp liked image</Heading>
        </Stack>
      </Stack>
      <Stack
        spacing="6"
        height="50vh"
        position="relative"
        sx={{
          ".crop-container": {
            position: "absolute",
            inset: 0,
          },
        }}
      >
        <Stack spacing="4" maxW="full" className="crop-container">
          <Image src={imageSource} alt="" />
        </Stack>
      </Stack>
      <Text textStyle="sm" color="fg.muted" textAlign="center">
        Image is never sent to servers, etc.
      </Text>
      <Button colorScheme="blue" onClick={handleDownload}>
        Download
      </Button>
    </Stack>
  );
}
