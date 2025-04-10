import React from 'react'
import { Button } from "@/components/ui/button"
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState } from "react"

export const TranslateMenuPage = () => {

const [preview, setPreview] = useState(null);
const [file, setFile] = useState(null);
const [fileName, setFileName] =useState("");

const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
    setFile(selected);
    setFileName(selected.name);
    setPreview(URL.createObjectURL(selected)); // for preview
    }
};

  return (
    <div className="flex flex-col gap-6">
      <Card className="mx-15 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Upload or take a picture of the menu</CardTitle>
        </CardHeader>
        <CardContent>
            <form className="flex flex-col gap-6">
                <div className = "grid gap-3">      
                    <label htmlFor="select-language">Please select menu language</label>
                    <select 
                    id = "select-language"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select Language</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Korean">Korean</option>
                        <option value="Japanese">Japanese</option>
                    </select>
                </div>
                
                <div className = "grid gap-3"> 
                    <label htmlFor = "upload">Select Picture</label>
                    <input 
                    id = "upload"
                    type="file" 
                    accept = "image/" 
                    onChange={handleImageChange} 
                    className="block w-full cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className = "grid gap-3"> 
            <AspectRatio ratio={16 / 9} className="bg-muted">
                   {preview ?  
                    <img
                       src={preview}
                       alt="Preview"
                       className="h-full w-full rounded-md object-cover"
                   /> : 
                   <img
                   src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                   alt="Placeholder"
                   className="h-full w-full rounded-md object-cover"
                   /> }
               </AspectRatio>
               <Button>Show result</Button>
               </div>

            </form>
        </CardContent>
     </Card>
    </div>
  );
}