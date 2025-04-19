import React, { useContext, useEffect, useRef } from "react";
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
import { CircleArrowDown, Upload } from "lucide-react";

export const TranslateMenuPage = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { handleCreateMenu, isLoading } = useContext(MenuContext);
  const fileInputRef = useRef(null);

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

  const handleImageClick = () => {
    fileInputRef.current.click();
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
          <div className="cursor-pointer relative" onClick={handleImageClick}>
            {preview ? null : (
              <div className="absolute flex flex-col items-center justify-center inset-0 z-10 bg-black/30 rounded-md">
                <h1 className="mt-3 flex flex-col text-2xl font-light text-white w-full justify-center items-center">
                  Chick here to add a menu
                  <Upload className="animate-bounce mt-5 size-8" />
                </h1>
              </div>
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
        </div>

        {/* Hidden file input */}
        <div className="hidden">
          <Label>Select picture</Label>
          <Input
            id="upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-3">
          <Label>Select a menu language</Label>

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
          <Label htmlFor="restaurant-name">Enter the restaurant name</Label>
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

        <div className="grid mb-6 w-10/12 m-auto">
          <Button disabled={isLoading || !isFormComplete}>
            {isLoading ? (
              <>
                {/* Spinner */}
                <LoadingSpinner />
                Processing... this can take 30 sec
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
