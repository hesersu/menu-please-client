import React, { useContext, useEffect, useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { MenuContext } from "@/contexts/menuContext";
import { Button } from "@/components/ui/button";
import { CupSoda, SpeakerIcon } from "lucide-react";

const ResultPage = () => {
  // Get menuId
  const { menuId } = useParams();
  const { handleGetOneMenu, currentMenu } = useContext(MenuContext);

  // Get One Menu

  useEffect(() => {
    handleGetOneMenu(menuId);
  }, [menuId]);

  return (
    <div className="flex flex-col mx-4 lg:w-10/12 m-auto">
      <div className="mt-2 mb-5">
        <AspectRatio ratio={1 / 1}>
          <img
            src={currentMenu && currentMenu.menuImg}
            alt="Current Menu"
            className="h-full w-full rounded-md object-cover"
          />
        </AspectRatio>
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
                  <div className="w-10/12 space-y-1">
                    <h3 className="text-md font-bold">{oneItem.nameEnglish}</h3>
                    <h4 className="text-md font-light font-style: italic">
                      {oneItem.nameOriginal} ({oneItem.phoneticPronunciation})
                    </h4>
                    <p className="text-md font-light">
                      {oneItem.descriptionEnglish}
                    </p>
                  </div>
                  <div>
                    <Button variant="default" className="ml-3">
                      <SpeakerIcon />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ResultPage;
