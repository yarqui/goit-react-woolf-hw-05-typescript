import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";
import "./index.css";

const rootEl = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
