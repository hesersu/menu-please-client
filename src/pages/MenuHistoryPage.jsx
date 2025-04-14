import { AuthContext } from '@/contexts/authContext';
import { MenuContext } from '@/contexts/menuContext'
import React, { useState } from 'react'
import { useContext, useEffect} from 'react'

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
} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';

export const MenuHistoryPage = () => {
    const {getAllMenusForOneUser, allMenusOneUser, allMenusOneUserLoading} = useContext(MenuContext);
    const {currentUser} = useContext(AuthContext);
    const [sorter, setSorter] = useState("Date");
    const [sortedMenus, setSortedMenus] = useState([]);
    const nav = useNavigate();

    useEffect(()=>{
    if (currentUser){
        getAllMenusForOneUser();
    }
    },[currentUser])
    
    useEffect(()=>{
      if(allMenusOneUser){
      if (sorter==="Restaurant") {
        const sorted = [...allMenusOneUser].sort((a, b) => {
          const nameA = a.restaurant_id.name.replace(/\s+/g, '').toLowerCase();
          const nameB = b.restaurant_id.name.replace(/\s+/g, '').toLowerCase();
          return nameA.localeCompare(nameB, undefined, { numeric: true });
        });
        setSortedMenus(sorted);
      }
          else if (sorter === "Date") {
          const sorted = [...allMenusOneUser].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setSortedMenus(sorted);
        } else if (sorter === "Location") {
          const sorted = [...allMenusOneUser].sort((a, b) =>
            a.restaurant_id.location.trim().toUpperCase().localeCompare(
              b.restaurant_id.location.trim().toUpperCase()
            )
          );
          setSortedMenus(sorted);
        } else {
          setSortedMenus(allMenusOneUser);
        }
      }
      }, [sorter, allMenusOneUser]);
  

  return (
    <>
    {!allMenusOneUserLoading ? (
    <div className={cn("flex flex-col gap-6")}>
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Menu History</CardTitle>
        <div className="flex justify-between item-center">
        <CardDescription>
            All the menus you translated
        </CardDescription>
              <Select
              value = {sorter}
              onValueChange={setSorter}>
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
      </CardHeader>
      <CardContent className="flex flex-col gap-y-6">
        {sortedMenus.map((oneMenu)=>{
          return(
          <div key={oneMenu._id}>
            <div className="grid grid-cols-4 gap-4 rounded-xl p-4 bg-card text-card-foreground shadow-card">
              <div onClick={()=>nav(`/results/${oneMenu._id}`)}>
                <img className="h-24 w-auto"src={oneMenu.menuImg} alt="Menu Picture" />
              </div>
              <div className="flex flex-col gap-3">
                  <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Name</span>
                  <span className="text-sm font-semibold text-foreground">{oneMenu.restaurant_id.name}</span>
              </div>
              <div className="flex flex-col gap-3"> 
                  <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Location</span>
                  <span className="text-sm font-semibold text-foreground">{oneMenu.restaurant_id.location}</span>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Date</span>
                  <span className="text-sm font-semibold text-foreground">{new Date(oneMenu.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
           </div>
        )})}
      </CardContent>
      <div className="flex flex-row gap-3 justify-center">
             <Button className="w-40" onClick={() => nav("/translate-menu")}>
               New Menu
             </Button>
           </div>
    </Card>
  </div>) : <h1>is loading</h1>}
  </>
  )
}


