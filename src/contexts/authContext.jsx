import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthContextWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  // This will authenticate the user
  const authenticateUser = async () => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (!tokenFromLocalStorage) {
      setCurrentUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
    } else {
      try {
        const repsonseFromVerifyRoute = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            headers: {
              authorization: `Bearer ${tokenFromLocalStorage}`,
            },
          }
        );
        console.log("authenticate user function", repsonseFromVerifyRoute);
        setCurrentUser(repsonseFromVerifyRoute.data.payload);
        console.log(repsonseFromVerifyRoute.data.payload)
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    }
  };
  //Use effect to run every time the page reloads
  useEffect(() => {
    authenticateUser();
  }, []);

  //logout the user by deleting the token from the LS
  async function handleLogout() {
    localStorage.removeItem("authToken");
    await authenticateUser();
    nav("/login");
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextWrapper };
