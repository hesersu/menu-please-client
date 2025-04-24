import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [allMenusOneUser, setAllMenusOneUser] = useState(null);
  const [allMenusOneUserLoading, setAllMenusOneUserLoading] = useState(true);
  const [currentOrderMenu, setCurrentOrderMenu] = useState("");
  const [uploadedFileURI, SetUploadedFileURI] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    console.log("currentMenu changed:", currentMenu);
  }, [currentMenu]);

  //* Upload File Function

  async function uploadFile(file) {
    // Create a new FormData object
    const formData = new FormData();
    const apiKey = import.meta.env.VITE_GEMINI_API;

    // Append the file to FormData with the correct field name
    formData.append("file", file);

    try {
      // Make the POST request to upload the file
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // No Authorization header needed if using API key in URL
          },
        }
      );

      // Log the response
      console.log("File uploaded successfully:", response.data);
      SetUploadedFileURI({
        imageUri: response.data.file.uri,
        mimeType: response.data.file.mimeType,
      });
      return response.data; // Return the response data which should contain the file ID
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  //* Handle create restaurant

  async function handleCreateRestaurant(name, location) {
    const restaurantObject = { name, location };
    try {
      const createdRestaurant = await axios.post(
        `${import.meta.env.VITE_API_URL}/restaurants/create`,
        restaurantObject
      );
      console.log("Restaurant Created", createdRestaurant.data._id);
      return createdRestaurant.data._id;
    } catch (err) {
      console.log("Error creating restaurant", err);
    }
  }

  //* Handle create menu

  async function handleCreateMenu(event, formMenuData) {
    event.preventDefault();
    setIsLoading(true);
    //Use Form Data because it is not only JSON, but mixed files incl. Image
    const uploadedFile = await uploadFile(formMenuData.file);
    console.log(
      "These are the file details",
      uploadedFile.file.uri,
      uploadedFile.file.mimeType
    );
    const dishes = await handleGeminiTranslation(
      uploadedFile.file.uri,
      uploadedFile.file.mimeType
    );
    console.log("dishes", typeof dishes);
    const restaurant_id = await handleCreateRestaurant(
      formMenuData.name,
      formMenuData.location
    );
    if (currentUser) {
      const myFormData = new FormData();
      myFormData.append("owner_id", currentUser._id);
      myFormData.append("language", formMenuData.language);
      myFormData.append("menuImg", formMenuData.file);
      myFormData.append("restaurant_id", restaurant_id);
      for (let [key, value] of myFormData.entries()) {
        //console.log(`${key}:`, value);
      }
      try {
        const responseCreate = await axios.post(
          `${import.meta.env.VITE_API_URL}/menus/create`,
          myFormData
        );
        console.log("create response", responseCreate.data._id);
        const responsePatch = await axios.patch(
          `${import.meta.env.VITE_API_URL}/menus/update-menu/${
            responseCreate.data._id
          }`,
          { dishes: JSON.parse(dishes) }
        );
        console.log("patch response", responsePatch.data);
        setIsLoading(false);
        nav(`/results/${responsePatch.data._id}`);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
  }

  //* Handle google Gemini Translation

  async function handleGeminiTranslation(image, mimeType) {
    const imageObject = {
      imageUri: image,
      mimeType: mimeType,
    };
    console.log(imageObject);
    try {
      const translatedMenu = await axios.post(
        `${import.meta.env.VITE_API_URL}/gemini/translate-menu-from-uri`,
        imageObject
      );
      console.log("Menu translated", translatedMenu.data);
      return translatedMenu.data;
    } catch (err) {
      console.log("Error translating with Gemini", err);
    }
  }

  async function createOrderMenu(order, language) {
    const orderObject = {
      order: order,
      language: language,
    };
    console.log(orderObject);
    try {
      const orderedMenu = await axios.post(
        `${import.meta.env.VITE_API_URL}/gemini/create-order`,
        orderObject
      );
      console.log("Ordered Menu", orderedMenu.data);
      setCurrentOrderMenu(orderedMenu.data);
      return orderedMenu.data;
    } catch (err) {
      console.log("Error creating order", err);
    }
  }

  //* Get All Menus for One User

  async function getAllMenusForOneUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/menus/all-menus-one-user?ownerId=${
          currentUser._id
        }`
      );
      console.log(res.data.allMenusForOneUser);
      setAllMenusOneUser(res.data.allMenusForOneUser);
      setAllMenusOneUserLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  //* Get One Menu

  async function handleGetOneMenu(oneMenuId) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/menus/one-menu/${oneMenuId}`
      );
      setCurrentMenu(res.data.oneMenu);
    } catch (err) {
      console.log(err);
    }
  }

  //* Delete One Menu

  async function handleDeleteMenu(oneMenuId) {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/menus/delete-menu/${oneMenuId}`
      );
      console.log("Menu removed", res);
      nav("/menu-history");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        isLoading,
        handleCreateMenu,
        handleDeleteMenu,
        handleCreateRestaurant,
        getAllMenusForOneUser,
        allMenusOneUser,
        allMenusOneUserLoading,
        handleGetOneMenu,
        createOrderMenu,
        currentOrderMenu,
        uploadFile
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuContextWrapper };
