import {
  Center,
  CenterProps,
  HStack,
  Icon,
  Square,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FileUp } from "lucide-react";

export const Dropzone = (props: CenterProps) => (
  <Center borderWidth="1px" borderRadius="lg" px="6" py="4" {...props}>
    <VStack spacing="3">
      <Square size="10" bg="bg.subtle" borderRadius="lg">
        <Icon as={FileUp} boxSize="5" color="fg.muted" />
      </Square>
      <VStack spacing="1">
        <HStack spacing="1" whiteSpace="nowrap">
          <Text textStyle="sm" color="gray.900">
            Click to upload
          </Text>
          <Text textStyle="sm" color="gray.600">
            or drag and drop
          </Text>
        </HStack>
        <Text textStyle="xs" color="gray.600">
          PNG, JPG up to 2MB
        </Text>
      </VStack>
    </VStack>
  </Center>
);
