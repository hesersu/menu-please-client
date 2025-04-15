import React, { useContext, useEffect, useState, useRef } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { MenuContext } from "@/contexts/menuContext";
import { SpeechContext } from "@/contexts/speechContext";
import { Button } from "@/components/ui/button";
import { CupSoda, SpeakerIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ResultPage = () => {
  const { menuId } = useParams();
  const { handleGetOneMenu, currentMenu, handleDeleteMenu, createOrderMenu } =
    useContext(MenuContext);
  const { googleTextToSpeech } = useContext(SpeechContext);
  const nav = useNavigate();
  const [orderItems, setOrderItems] = useState({});
  const [imageOpen, setImageOpen] = useState(false);

  // Get One Menu

  useEffect(() => {
    handleGetOneMenu(menuId);
  }, [menuId]);

  // Ordering - Initialize empty order items when menu changes
  useEffect(() => {
    if (currentMenu) {
      const initialOrderItems = {};
      currentMenu.dishes.forEach((dish) => {
        initialOrderItems[dish._id] = ""; // Use empty string instead of 0
      });
      setOrderItems(initialOrderItems);
    }
  }, [currentMenu]);

  // Ordering - Function to handle quantity changes
  const handleQuantityChange = (dishId, value) => {
    setOrderItems((prev) => ({
      ...prev,
      [dishId]: value, // Store the raw value
    }));
  };

  // Ordering - For the getOrderArray function, parse the integers when needed
  const getOrderArray = () => {
    return Object.keys(orderItems)
      .map((dishId) => {
        const dish = currentMenu.dishes.find((d) => d._id === dishId);
        return {
          amount: parseInt(orderItems[dishId]) || 0,
          item: dish.nameOriginal, // Convert to integer here
        };
      })
      .filter((item) => item.amount > 0);
  };

  return (
    <div className="flex flex-col mx-4 lg:w-10/12 m-auto">
      <div className="mt-2 mb-5">
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              {/* <AspectRatio ratio={1 / 1}> */}
              <img
                src={currentMenu && currentMenu.menuImg}
                alt="Current Menu"
                className="h-full w-full rounded-md object-cover hover:opacity-90 transition-opacity sm:max-w-[90vw] max-h-[90vh]"
              />
              {/* </AspectRatio> */}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
            <DialogTitle className="visibility: hidden">Your Menu</DialogTitle>
            <div className="w-full h-full flex items-center justify-center mt-4">
              <img
                src={currentMenu && currentMenu.menuImg}
                alt="Current Menu"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <h1 className="text-xl my-2">Menu Items</h1>
        {currentMenu &&
          currentMenu.dishes.map((oneItem) => {
            return (
              <div key={oneItem._id} className="pt-3">
                <div className="flex flex-row justify-center space-y-5">
                  <div className="mr-3">
                    <CupSoda />
                  </div>
                  <div className="w-8/12 space-y-1">
                    <h3 className="text-md font-bold">{oneItem.nameEnglish}</h3>
                    <h4 className="text-md font-light font-style: italic">
                      {oneItem.nameOriginal} ({oneItem.phoneticPronunciation})
                    </h4>
                    <p className="text-md font-light">
                      {oneItem.descriptionEnglish}
                    </p>
                  </div>
                  <div className="w-2/12">
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={
                        orderItems[oneItem._id] === ""
                          ? ""
                          : orderItems[oneItem._id]
                      }
                      onChange={(e) =>
                        handleQuantityChange(oneItem._id, e.target.value)
                      }
                    />
                  </div>
                  <div className="w-2/12">
                    <Button
                      onClick={() =>
                        googleTextToSpeech(
                          oneItem.nameOriginal,
                          currentMenu.language
                        )
                      }
                      variant="outline"
                      className="ml-3"
                    >
                      <SpeakerIcon />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            );
          })}
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-6/12 flex justify-center">
          <Button
            onClick={() => {
              const orderArray = getOrderArray();
              console.log("Order items:", orderArray);
              // Send to API or handle as needed
              createOrderMenu(orderArray, currentMenu.language);
            }}
            variant="default"
            className="my-6 w-10/12"
          >
            Submit Order
          </Button>
        </div>
        <div className="w-6/12 flex justify-center">
          <Button
            onClick={() => nav("/menu-history")}
            variant="default"
            className="my-6 w-10/12"
          >
            View all menus
          </Button>
        </div>

        <div className="w-6/12 flex justify-center">
          <Button
            onClick={() => handleDeleteMenu(menuId)}
            variant="destructive"
            className="my-6 w-10/12"
          >
            Delete menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
