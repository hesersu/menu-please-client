import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/darkmode-toggle";
import LogoImage from "../assets/menu-please-logo.png";

// Shadcn Components
import { BookOpenText, CameraIcon, Heart, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const Navbar = ({}) => {
  // Login Status

  const { isLoggedIn, handleLogout, currentUser } = useContext(AuthContext);

  // Page Content
  return (
    <section className="py-2">
      <div className="block mx-4">
        <div className="flex items-center justify-between">
          <a href="/translate-menu" className="flex items-center gap-2">
            <img
              src={LogoImage}
              className="max-h-12"
              alt="Menu, Please! Logo"
            />
          </a>
          <Sheet>
            <SheetTrigger asChild className="">
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-light text-sm"></SheetTitle>
                {/* User Image */}
                <div className="flex flex-row align-center mb-8">
                  <Avatar className="h-15 w-15 mr-5 mt-10">
                    <AvatarImage
                      src={currentUser && currentUser.profileImage}
                      alt={currentUser && currentUser.username}
                    />
                    <AvatarFallback>
                      {currentUser && currentUser.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <SheetDescription className="h-15 mr-5 mt-10 font-bold text-1xl content-center">
                    Welcome, {currentUser && currentUser.username}!
                  </SheetDescription>
                </div>
                <div className="flex flex-row justify-between align-center mb-5">
                  <h3 className="text-md py-0 font-semibold hover:no-underline">
                    Restaurant Mode
                  </h3>
                  <DarkModeToggle className="mr-5" />
                </div>
                <Separator />
              </SheetHeader>
              <div className="flex flex-col flex-grow gap-6 px-4">
                <Link to="/translate-menu">
                  <h3 className="text-md py-0 font-semibold hover:no-underline flex items-center gap-3">
                    <CameraIcon /> Translate Menus
                  </h3>
                </Link>
                <Link to="/menu-history">
                  <h3 className="text-md py-0 font-semibold hover:no-underline flex gap-3">
                    <BookOpenText /> Menu history
                  </h3>
                </Link>
                <Separator className="my-3" />
                <div className="flex flex-col gap-3 pt-3 align-middle justify-center">
                  {isLoggedIn ? (
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  ) : (
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="mr-8">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="px-4 mt-auto mb-12">
                  <Separator className="my-5" />
                  <h3 className="flex text-sm font-light justify-center text-center">
                    Love "Menu, Please"? <br />
                    Become a supporter!
                  </h3>
                  <a
                    href="https://www.buymeacoffee.com/menuplease"
                    className="flex justify-center w-full mt-3 scale-90"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=&slug=menuplease&button_colour=eb52a9&font_colour=FFFFFF&font_family=&outline_colour=000000&coffee_colour=FFDD00" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};
