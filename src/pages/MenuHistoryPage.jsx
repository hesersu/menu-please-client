import { AuthContext } from "@/contexts/authContext";
import { MenuContext } from "@/contexts/menuContext";
import React from "react";
import { useContext, useEffect } from "react";

// Shadcn components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MenuHistoryPage = () => {
  const { getAllMenusForOneUser, allMenusOneUser, allMenusOneUserLoading } =
    useContext(MenuContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      getAllMenusForOneUser();
    }
  }, [currentUser]);

  if (!allMenusOneUserLoading) {
    console.log("allMenusOneUser", allMenusOneUser);
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>
          <CardDescription>
            Enter your username, email and password below to create to your
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <h1>test</h1>
            </div>
            <div className="grid gap-3"></div>
            <div className="grid gap-3"></div>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Sign-up
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
