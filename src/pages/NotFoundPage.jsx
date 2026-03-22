"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import image404 from "../assets/menu-please-404.png";

export const NotFoundPage = () => {
  const errorMessages = [
    { language: "Chinese", text: "404 页面未找到" },
    { language: "Korean", text: "404 페이지를 찾을 수 없습니다" },
    { language: "Japanese", text: "404 ページが見つかりません" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start fade out
      setVisible(false);

      // After fade out completes, change the text and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % errorMessages.length);
        setVisible(true);
      }, 500); // Half a second for fade out
    }, 5000); // Total cycle time

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      <Card className="gap-0 bg-card text-card-foreground w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-5">
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center text-3xl mb-2">
            <img className="size-35" src={image404}></img>
          </CardTitle>
          <CardDescription>
            <div className="h-12 flex items-center justify-center">
              <p
                className={`text-2xl font-medium text-pink-600 transition-opacity duration-500 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                {errorMessages[currentIndex].text}
              </p>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-md text-muted-foreground">
            Sorry, the page you're looking for <br /> doesn't exist.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center"></CardFooter>
      </Card>
    </div>
  );
};

export default NotFoundPage;
