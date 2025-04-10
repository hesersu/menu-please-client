import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar1 } from "./components/navbar";
import { TranslateMenuPage } from "./pages/TranslateMenuPage";

function App() {
  return (
    <>
      <Navbar1 />
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/translate-menu" element={<TranslateMenuPage/>} />
      </Routes>
    </>
  );
}

export default App;
