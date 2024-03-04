import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootNode = document.getElementById("root");
if (rootNode === null) {
  console.error("root node not found!");
} else {
  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
