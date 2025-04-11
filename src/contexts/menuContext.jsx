import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  async function handleCreateMenu (event, formMenuData) {
    event.preventDefault();  
    console.log(formMenuData);
  }  

//   async function handleCreateRestaurant() {

//   }

//   async function getMenuDataFromGoogle(){

//   }

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        isLoading,
        handleCreateMenu
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuContextWrapper };
