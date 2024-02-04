import { Button } from "@chakra-ui/react";
import { useStateCtx } from "../../use-context";
import { useCallback } from "react";

const commonStyles = {
  minW: "108px",
}

export function ResetButton() {
  const { dispatch } = useStateCtx();

  const handleReset = useCallback(
    () => dispatch({ type: "reset" }),
    [dispatch]
  );

  return (
    <Button colorScheme="red" onClick={handleReset} {...commonStyles}>
      Reset
    </Button>
  );
}

type Props = {
  text: string;
  onClick: VoidFunction, isDisabled?: boolean
}

export function PositiveButton({ onClick, isDisabled, text }: Props) {
  return (
    <Button colorScheme="blue" onClick={onClick} isDisabled={isDisabled} {...commonStyles}>
      {text}
    </Button>
  );
}
