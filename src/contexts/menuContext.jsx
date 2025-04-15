import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { AuthContext } from "./authContext";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [allMenusOneUser, setAllMenusOneUser] = useState(null);
  const [allMenusOneUserLoading, setAllMenusOneUserLoading] = useState(true);
  const [currentOrderMenu, setCurrentOrderMenu] = useState("")
  const nav = useNavigate();

  useEffect(() => {
    console.log("currentMenu changed:", currentMenu);
  }, [currentMenu]);

  //* Upload File Workaround

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
      setCurrentRestaurantId(createdRestaurant.data._id);
      return createdRestaurant.data._id;
    } catch (err) {
      console.log("Error creating restaurant", err);
    }
  }

  //* Handle create menu

  async function handleCreateMenu(event, formMenuData) {
    event.preventDefault();
    //Use Form Data because it is not only JSON, but mixed files incl. Image
    const uploadedFile = await uploadFile(formMenuData.file);
    const dishes = await handleGeminiTranslation(formMenuData.file);
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
        nav(`/results/${responsePatch.data._id}`);
      } catch (err) {
        console.log(err);
      }
    }
  }

  //* Handle google Gemini Translation

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API,
  });

  async function handleGeminiTranslation(imageFile) {
    const image = await ai.files.upload({
      file: imageFile,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          "Help me translate a menu",
          createPartFromUri(image.uri, image.mimeType),
        ]),
      ],
      config: {
        systemInstruction:
          "You are a magical cat helping to translate restaurant menus. Your name is Neko.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              categoryOriginal: {
                type: "string",
                description: "Category name of the food in original language",
              },
              categoryEnglish: {
                type: "string",
                description:
                  "Category name of the food translated in English language",
              },
              nameOriginal: {
                type: "string",
                description: "The name of the food item in original characters",
              },
              nameEnglish: {
                type: "string",
                description:
                  "The name of the food item translated in English language",
              },
              phoneticPronunciation: {
                type: "string",
                description:
                  "The phonetic pronunciation of the food name e.g. in chinese use pinyin",
              },
              descriptionEnglish: {
                type: "string",
                description: "A description of the food item in English",
              },
            },
            required: [
              "categoryOriginal",
              "categoryEnglish",
              "nameOriginal",
              "nameEnglish",
              "phoneticPronunciation",
              "descriptionEnglish",
            ],
          },
        },
      },
    });
    console.log(response.text);
    return response.text;
  }

  async function createOrderMenu(order, language) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Please generate a natural-sounding, waiter-friendly restaurant order in ${language} with a polite greeting. Here is the order as an array: ${JSON.stringify(
        order
      )}`,
      config: {
        systemInstruction:
          "You help a customer formulating an order for the waiter",
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              orderOriginal: {
                type: "string",
                description:
                  "Restaurant order in target language (see prompt) that a customer can communicate to the waiter. Example: 你好，我想点两份宫保鸡丁",
              },
              orderPronunciation: {
                type: "string",
                description:
                  "Restaurant order pronunciation so that a customer can communicate to the waiter. Example: Nǐ hǎo, wǒ xiǎng diǎn liǎng fèn gōng bǎo jī dīng",
              },
              orderTranslation: {
                type: "string",
                description:
                  "Restaurant order translated in English, pay attention that the menu items are translated properly",
              },
            },
            required: ["orderOriginal", "orderPronunciation", "orderTranslation"],
          },
        },
      },
    });

    const chineseText = await response.text;
    console.log("Waiter-friendly order:", chineseText);
    //transform text into array
    const parsedArray = JSON.parse(chineseText); 
    console.log(parsedArray)
    setCurrentOrderMenu(parsedArray);
    return chineseText;
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
        currentOrderMenu
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuContextWrapper };
