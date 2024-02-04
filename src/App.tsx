import { Box, Container } from "@chakra-ui/react";
import { useStateCtx } from "./use-context";
import { SelectImage } from "./screen/SelectImage";
import { CropImage } from "./screen/CropImage";
import { BinarizedImage } from "./screen/BinarizedImage";

export function App() {
  const { state } = useStateCtx();

  return (
    <Box
      w="full"
      h="100vh"
      bgGradient={{ sm: "linear(to-r, blue.600, blue.400)" }}
      py={{ base: "12", md: "24" }}
    >
      <Container
        maxW="lg"
        py={{ base: "0", sm: "8" }}
        px={{ base: "4", sm: "10" }}
        bg={{ base: "transparent", sm: "white" }}
        boxShadow={{ base: "none", sm: "xl" }}
        borderRadius={{ base: "none", sm: "xl" }}
      >
        {state.seen === "initial" && <SelectImage />}
        {state.seen === "crop" && <CropImage file={state.original} />}
        {state.seen === "binarized" && <BinarizedImage file={state.processed} />}
      </Container>
    </Box>
  );
}
