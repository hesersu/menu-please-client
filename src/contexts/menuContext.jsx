import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {currentUser} = useContext(AuthContext);
  const nav = useNavigate();

  async function handleCreateMenu (event, formMenuData) {
    event.preventDefault();  
    //Use Form Data because it is not only JSON, but mixed files incl. Image
    if(currentUser){
    const myFormData = new FormData()
    console.log(currentUser)
    myFormData.append('owner_id', currentUser._id)
    myFormData.append('language', formMenuData.language)
    myFormData.append('menuImg', formMenuData.file)
    for (let [key, value] of myFormData.entries()) {
        console.log(`${key}:`, value);
      }
    try {
        const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/menus/create`, myFormData)
        console.log(data)
    } 
    catch(err) { 
        console.log(err)
    }
   }
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
