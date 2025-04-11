import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  //* Handle create restaurant function

  async function handleCreateMenu(event, formMenuData) {
    event.preventDefault();
    handleCreateRestaurant(formMenuData.name, formMenuData.location);
    console.log(formMenuData);
  }

  // //! Backup for quickly calling menu
  // handleCreateRestaurant(formMenuData.name, formMenuData.location);

  //* Handle create restaurant

  async function handleCreateRestaurant(name, location) {
    const restaurantObject = { name, location };
    try {
      const createdRestaurant = await axios.post(
        `${import.meta.env.VITE_API_URL}/restaurants/create`,
        restaurantObject
      );
      console.log("Restaurant Created", createdRestaurant.data._id);
      setCurrentRestaurantId(createdRestaurant.data._id);
    } catch (err) {
      console.log("Error creating restaurant", err);
    }
  }

  //   async function getMenuDataFromGoogle(){

  //   }

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        isLoading,
        handleCreateMenu,
        handleCreateRestaurant,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuContextWrapper };
