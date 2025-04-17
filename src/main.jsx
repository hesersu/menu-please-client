import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Browser } from "react-router-dom";
import { AuthContextWrapper } from "./contexts/authContext";
import { MenuContextWrapper } from "./contexts/menuContext";
import { SpeechContextWrapper } from "./contexts/speechContext";
import { PostHogProvider } from "posthog-js/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Browser>
      <AuthContextWrapper>
        <SpeechContextWrapper>
          <MenuContextWrapper>
            <PostHogProvider
              apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
              options={{
                api_host: "https://eu.i.posthog.com",
                debug: import.meta.env.MODE === "development",
              }}
            >
              <App />
            </PostHogProvider>
          </MenuContextWrapper>
        </SpeechContextWrapper>
      </AuthContextWrapper>
    </Browser>
  </StrictMode>
);
