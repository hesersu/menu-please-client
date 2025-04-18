import React, { useContext, useEffect, useState, useRef } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { MenuContext } from "@/contexts/menuContext";
import { SpeechContext } from "@/contexts/speechContext";
import { Button } from "@/components/ui/button";
import { CupSoda, Dot, Megaphone, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableHead, TableRow } from "@/components/ui/table";

const ResultPage = () => {
  const { menuId } = useParams();
  const { handleGetOneMenu, currentMenu, createOrderMenu } =
    useContext(MenuContext);
  const { googleTextToSpeech, isPlaying } = useContext(SpeechContext);
  const nav = useNavigate();
  const [orderItems, setOrderItems] = useState({});
  const [imageOpen, setImageOpen] = useState(false);
  const [categorizedDishes, setCategorizedDishes] = useState({});

  // Get One Menu
  useEffect(() => {
    handleGetOneMenu(menuId);
  }, [menuId]);

  // Ordering - Initialize empty order items when menu changes
  // and categorize dishes
  useEffect(() => {
    if (currentMenu) {
      const initialOrderItems = {};
      const dishByCategory = {};

      currentMenu.dishes.forEach((dish) => {
        initialOrderItems[dish._id] = ""; // Use empty string instead of 0

        // Group dishes by category
        const categoryKey = dish.categoryEnglish || "Uncategorized";
        if (!dishByCategory[categoryKey]) {
          dishByCategory[categoryKey] = {
            categoryOriginal: dish.categoryOriginal || "",
            dishes: [],
          };
        }
        dishByCategory[categoryKey].dishes.push(dish);
      });

      setOrderItems(initialOrderItems);
      setCategorizedDishes(dishByCategory);
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

  // Render a single dish item
  const renderDishItem = (oneItem) => (
    <div key={oneItem._id} className="pt-3">
      <div className="flex flex-row justify-between space-y-5">
        <div className="w-8/12 space-y-1">
          <h3 className="text-md font-bold">{oneItem.nameEnglish}</h3>
          <h4 className="text-md font-light italic">
            {oneItem.nameOriginal} ({oneItem.phoneticPronunciation})
          </h4>
          <p className="text-md font-light">{oneItem.descriptionEnglish}</p>
        </div>
        <div className="w-2/12 ml-3">
          <Input
            type="number"
            placeholder="0"
            min="0"
            value={
              orderItems[oneItem._id] === "" ? "" : orderItems[oneItem._id]
            }
            onChange={(e) => handleQuantityChange(oneItem._id, e.target.value)}
          />
        </div>
        <div className="w-2/12">
          <Button
            onClick={() =>
              googleTextToSpeech(oneItem.nameOriginal, currentMenu.language)
            }
            variant="outline"
            className="ml-3"
            disabled={isPlaying}
          >
            <Megaphone />
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  return (
    <div className="flex flex-col mx-4 lg:w-10/12 m-auto">
      <div className="mt-2 mb-5">
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <img
                src={currentMenu && currentMenu.menuImg}
                alt="Current Menu"
                className="h-full w-full rounded-md object-cover hover:opacity-90 transition-opacity sm:max-w-[90vw] max-h-[90vh]"
              />
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
        {/* Render categorized dishes */}
        {Object.keys(categorizedDishes).map((categoryKey) => {
          const category = categorizedDishes[categoryKey];
          return (
            <div key={categoryKey} className="mb-6">
              <div className="flex items-center py-4">
                <h2 className="text-lg font-semibold">{categoryKey}</h2>
                {category.categoryOriginal && (
                  <span className="ml-2 text-sm italic">
                    ({category.categoryOriginal})
                  </span>
                )}
              </div>
              <TableRow className="flex text-sm font-light gap-5">
                <TableHead className="w-10/12 p-0">Description</TableHead>
                <TableHead className="w-2/12 p-0">Amount</TableHead>
                <TableHead className="w-2/12 p-0">Audio</TableHead>
              </TableRow>

              {category.dishes.map(renderDishItem)}
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-full flex justify-center">
          <Button
            onClick={() => {
              const orderArray = getOrderArray();
              console.log("Order items:", orderArray);
              createOrderMenu(orderArray, currentMenu.language);
              nav(`/order-menu/${menuId}`);
            }}
            variant="default"
            className="my-6 w-10/12"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
