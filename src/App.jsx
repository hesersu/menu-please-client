import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar } from "./components/navbar";
import { TranslateMenuPage } from "./pages/TranslateMenuPage";
import ResultPage from "./pages/ResultPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/translate-menu"
          element={
            <ProtectedRoute>
              <TranslateMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:menuId"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
