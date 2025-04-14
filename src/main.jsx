import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Browser } from "react-router-dom";
import { AuthContextWrapper } from "./contexts/authContext";
import { MenuContextWrapper } from "./contexts/menuContext";
import { SpeechContextWrapper } from "./contexts/speechContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Browser>
      <AuthContextWrapper>
        <SpeechContextWrapper>
          <MenuContextWrapper>
            <App />
          </MenuContextWrapper>
        </SpeechContextWrapper>
      </AuthContextWrapper>
    </Browser>
  </StrictMode>
);
