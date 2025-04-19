import { AuthContext } from "@/contexts/authContext";
import { MenuContext } from "@/contexts/menuContext";
import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { Delete, Trash, Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export const MenuHistoryPage = () => {
  const {
    getAllMenusForOneUser,
    allMenusOneUser,
    allMenusOneUserLoading,
    handleDeleteMenu,
  } = useContext(MenuContext);
  const { currentUser } = useContext(AuthContext);
  const [sorter, setSorter] = useState("Date");
  const [sortedMenus, setSortedMenus] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (currentUser) {
      getAllMenusForOneUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (allMenusOneUser) {
      if (sorter === "Restaurant") {
        const sorted = [...allMenusOneUser].sort((a, b) => {
          const nameA = a.restaurant_id.name.replace(/\s+/g, "").toLowerCase();
          const nameB = b.restaurant_id.name.replace(/\s+/g, "").toLowerCase();
          return nameA.localeCompare(nameB, undefined, { numeric: true });
        });
        setSortedMenus(sorted);
      } else if (sorter === "Date") {
        const sorted = [...allMenusOneUser].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSortedMenus(sorted);
      } else if (sorter === "Location") {
        const sorted = [...allMenusOneUser].sort((a, b) =>
          a.restaurant_id.location
            .trim()
            .toUpperCase()
            .localeCompare(b.restaurant_id.location.trim().toUpperCase())
        );
        setSortedMenus(sorted);
      } else {
        setSortedMenus(allMenusOneUser);
      }
    }
  }, [sorter, allMenusOneUser]);

  return (
    <>
      {!allMenusOneUserLoading && (
        <div
          className={cn(
            "flex flex-col gap-6 text-card-foreground p-6 rounded-xl"
          )}
        >
          <div className="flex flex-col gap-2 lg:w-8/12 lg:mx-auto">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Menu History
            </h2>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                All the menus you translated
              </p>
              <Select value={sorter} onValueChange={setSorter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="Date">Date</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Location">Location</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            {sortedMenus.map((oneMenu) => (
              <div key={oneMenu._id}>
                <div className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 rounded-xl p-4 bg-card text-card-foreground shadow-card">
                  <div onClick={() => nav(`/results/${oneMenu._id}`)}>
                    <img
                      className="h-25 w-auto"
                      src={oneMenu.menuImg}
                      alt="Menu Picture"
                    />
                  </div>

                  <div className="grid grid-rows-3 place-content-center gap-y-2">
                    <span className="text-xs font-medium text-muted-foreground tracking-wider">
                      Restaurant:
                    </span>
                    <span className="text-xs font-medium text-muted-foreground tracking-wider">
                      Location:
                    </span>
                    <span className="text-xs font-medium text-muted-foreground tracking-wider">
                      Created at:
                    </span>
                  </div>

                  <div className="grid grid-rows-3 place-content-center gap-y-2">
                    <span className="text-sm font-semibold text-foreground">
                      {oneMenu.restaurant_id.name}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {oneMenu.restaurant_id.location}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {new Date(oneMenu.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 justify-start">
                    <Trash2
                      onClick={async () => {
                        await handleDeleteMenu(oneMenu._id);
                        console.log(oneMenu._id);
                        await getAllMenusForOneUser();
                      }}
                    />
                    {/* <Pencil/> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-3 justify-center">
            <Button className="w-40" onClick={() => nav("/translate-menu")}>
              New Menu
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
