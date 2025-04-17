import React, { useContext, useEffect } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { AccordionItem } from "@radix-ui/react-accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { MenuContext } from "@/contexts/menuContext";
import { CircleArrowDown } from "lucide-react";

export const TranslateMenuPage = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { handleCreateMenu, isLoading } = useContext(MenuContext);

  //check if the form has been filled out completely
  useEffect(() => {
    setIsFormComplete(
      name.trim() !== "" &&
        location.trim() !== "" &&
        language !== "" &&
        file !== null
    );
  }, [name, location, language, file]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setFile(selectedImage);
      setFileName(selectedImage.name);
      setPreview(URL.createObjectURL(selectedImage)); // for preview
    }
  };

  return (
    <div className="flex flex-col mx-4 lg:w-10/12 m-auto">
      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          handleCreateMenu(event, {
            language,
            file,
            name,
            location,
          });
        }}
      >
        <div className="grid relative">
          {preview ? null : (
            <h1 className="mt-3 flex flex-col absolute text-2xl font-light text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12/12 justify-center items-center z-1">
              add a photo below
              <CircleArrowDown className="mt-5 size-8 animate-bounce" />
            </h1>
          )}
          <AspectRatio ratio={1 / 1} className="bg-muted">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1605184861755-8f190fea96a5?q=80"
                alt="Placeholder"
                className="h-full w-full rounded-md object-cover"
              />
            )}
          </AspectRatio>
        </div>
        <div className="grid gap-3">
          <Label>Select picture</Label>
          <Input
            id="upload"
            type="file"
            accept="image/"
            onChange={handleImageChange}
          />
        </div>
        <div className="grid gap-3">
          <Label>Select menu language</Label>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="restaurant-name">
            Please enter the restaurant name
          </Label>
          <Input
            id="restaurant-name"
            type="text"
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="restaurant-location">
            Please enter the restaurant location
          </Label>
          <Input
            id="restaurant-location"
            type="text"
            placeholder="Restaurant Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center justify-center mb-6 w-10/12 mx-auto gap-2">
          {isLoading}
          <Button className="w-xs" disabled={isLoading || !isFormComplete}>
            {isLoading ? (
              <>
                {/* Spinner */}
                <LoadingSpinner />
                Processing...
              </>
            ) : (
              "See Result"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
