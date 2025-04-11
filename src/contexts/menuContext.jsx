import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const MenuContext = createContext();

const MenuContextWrapper = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  //* Handle create restaurant function

  async function handleCreateMenu(event, formMenuData) {
    event.preventDefault();
    console.log(formMenuData);
  }

  // //! Backup for quickly calling menu
  // handleCreateRestaurant(formMenuData.name, formMenuData.location);
  // handleGeminiTranslation();

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

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API,
  });

  async function handleGeminiTranslation() {
    const image = await ai.files.upload({
      file: "../assets/test-menu.png",
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
  }

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
