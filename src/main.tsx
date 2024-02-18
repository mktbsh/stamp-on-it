import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import { App } from "./App";
import { StateProvider } from "./provider";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChakraProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </ChakraProvider>
  </React.StrictMode>
);
