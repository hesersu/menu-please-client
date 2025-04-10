import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Browser } from "react-router-dom";
import { AuthContextWrapper } from "./contexts/authContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Browser>
      <AuthContextWrapper>
        <App />
      </AuthContextWrapper>
    </Browser>
  </StrictMode>
);
