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
  const {currentUser} = useContext(AuthContext);
  const [allMenusOneUser, setAllMenusOneUser] = useState(null);
  const [allMenusOneUserLoading, setAllMenusOneUserLoading] = useState(true)
  const nav = useNavigate();

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
  
  async function handleCreateMenu (event, formMenuData) {
    event.preventDefault();  
    //Use Form Data because it is not only JSON, but mixed files incl. Image
    const dishes = await handleGeminiTranslation(formMenuData.file)
    console.log("dishes", typeof dishes)
    const restaurant_id = await handleCreateRestaurant(formMenuData.name, formMenuData.location)
    if(currentUser){
    const myFormData = new FormData()
    myFormData.append('owner_id', currentUser._id)
    myFormData.append('language', formMenuData.language)
    myFormData.append('menuImg', formMenuData.file)
    myFormData.append('restaurant_id', restaurant_id)
    for (let [key, value] of myFormData.entries()) {
        //console.log(`${key}:`, value);
      }
    try {
        const responseCreate = await axios.post(`${import.meta.env.VITE_API_URL}/menus/create`, myFormData)
        console.log("create response", responseCreate.data._id)
        const responsePatch = await axios.patch(`${import.meta.env.VITE_API_URL}/menus/update-menu/${responseCreate.data._id}`, {dishes:JSON.parse(dishes)})
        console.log("patch response", responsePatch.data)
    } 
    catch(err) { 
        console.log(err)
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
          "Tell me about this instrument",
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

  async function getAllMenusForOneUser(){
    try{
    const allMenusforOneUser = await axios.get(`${import.meta.env.VITE_API_URL}/menus/all-menus-one-user?ownerId=${currentUser._id}`)
    console.log(allMenusforOneUser.data)
    setAllMenusOneUser(allMenusforOneUser.data)
    setAllMenusOneUserLoading(false);
  } catch(err){console.log(err)}
  }

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        isLoading,
        handleCreateMenu,
        handleCreateRestaurant,
        getAllMenusForOneUser,
        allMenusOneUser,
        allMenusOneUserLoading
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuContextWrapper };
