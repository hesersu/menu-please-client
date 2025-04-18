import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar } from "./components/navbar";
import { TranslateMenuPage } from "./pages/TranslateMenuPage";
import { MenuHistoryPage } from "./pages/MenuHistoryPage";
import ResultPage from "./pages/ResultPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OrderMenuPage } from "./pages/OrderMenuPage";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import Footer from "./components/footer";

function App() {
  return (
    <ThemeProvider>
      <>
        <Navbar />
        <Routes>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/menu-history"
            element={
              <ProtectedRoute>
                <MenuHistoryPage />
              </ProtectedRoute>
            }
          />
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
            path="/"
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
          <Route
            path="/order-menu/:menuId"
            element={
              <ProtectedRoute>
                <OrderMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about-us"
            element={
              <ProtectedRoute>
                <AboutUsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-center" richColors />
        <Footer />
      </>
    </ThemeProvider>
  );
}

export default App;
