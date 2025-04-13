import React, { useContext, useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CupSoda, Speaker, SpeakerIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { MenuContext } from "@/contexts/menuContext";

const ResultPage = () => {
  // Get menuId
  const { menuId } = useParams();
  const { handleGetOneMenu } = useContext(MenuContext);

  // Test
  console.log("Menu ID:", menuId);

  // Get One Menu

  useEffect(() => {
    console.log(handleGetOneMenu(menuId));
  }, []);

  return (
    <div className="flex flex-col mx-4 lg:w-10/12 m-auto">
      <div className="mt-2 mb-5">
        <AspectRatio ratio={1 / 1}>
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Image"
            className="h-full w-full rounded-md object-cover"
          />
        </AspectRatio>
      </div>
      <div>
        <h3 className="flex items-center gap-2 mb-3">
          <CupSoda />
          Drinks
        </h3>
        <Separator />
      </div>
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>燒餅油條 | Baked Flatbread</AccordionTrigger>
            <AccordionContent>
              Baked flatbread with fried dough stick.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ResultPage;
