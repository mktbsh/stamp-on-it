import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { useStateCtx } from "../use-context";
import { getCroppedImg } from "../lib";
import { PositiveButton, ResetButton } from "./_components/buttons";

type Props = {
  file: Blob;
};

export function CropImage({ file }: Props) {
  const { dispatch } = useStateCtx();

  const [imageSource, setImageSource] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

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

  const handleSubmit = async () => {
    if (!imageSource) return;
    if (!croppedAreaPixels) return;

    try {
      const cropped = await getCroppedImg(imageSource, croppedAreaPixels, 0);
      if (!cropped) return;

      dispatch({
        type: "crop",
        payload: {
          area: croppedAreaPixels,
          cropped,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack spacing="6">
      <Stack spacing="6" align="center">
        <Stack spacing="3" textAlign="center">
          <Heading size="xs">Crop your image</Heading>
          <Text color="fg.muted">
            Adjust the position of the image to be cropped
          </Text>
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
          <Cropper
            image={imageSource}
            crop={crop}
            zoom={zoom}
            aspect={1}
            // restrictPosition={false}
            cropShape="round"
            onCropChange={(crop) => setCrop(crop)}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={(zoom) => setZoom(zoom)}
          />
        </Stack>
      </Stack>
      <Text textStyle="sm" color="fg.muted" textAlign="center">
        Image is never sent to servers, etc.
      </Text>
      <Flex w="full" justifyContent="center" gap="4">
        <ResetButton />
        <PositiveButton text="Submit"  onClick={handleSubmit} isDisabled={croppedAreaPixels == null} />
      </Flex>
    </Stack>
  );
}
