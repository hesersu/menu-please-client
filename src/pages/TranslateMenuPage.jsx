import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
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
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { MenuContext } from "@/contexts/menuContext";

export const TranslateMenuPage = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const { handleCreateMenu } = useContext(MenuContext);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setFile(selectedImage);
      setFileName(selectedImage.name);
      setPreview(URL.createObjectURL(selectedImage)); // for preview
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="mx-15 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Upload or take a picture of the menu</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="grid gap-3">
              <label htmlFor="select-language">
                Please select menu language
              </label>

              <Select
                value={language}
                onValueChange={setLanguage}
              >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a langauge" />
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
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="upload">Select Picture</label>
              <Input
                id="upload"
                type="file"
                accept="image/"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid gap-3">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                    alt="Placeholder"
                    className="h-full w-full rounded-md object-cover"
                  />
                )}
              </AspectRatio>
              <Button>Show result</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
