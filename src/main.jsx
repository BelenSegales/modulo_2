import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MonedaProvider } from "./context/MonedaProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MonedaProvider>
        <App />
      </MonedaProvider>
    </BrowserRouter>
  </StrictMode>,
);
