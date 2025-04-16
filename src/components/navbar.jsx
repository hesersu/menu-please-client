import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/darkmode-toggle";

// Shadcn Components
import { Book, BookA, Menu, MenuIcon, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { FormLabel } from "./ui/form";

export const Navbar = ({
  logo = {
    url: "/",
    src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },

  menu = [
    { title: `Add Menu`, url: "/translate-menu" },
    { title: "History", url: "/menu-history" },
    { title: "Settings", url: "#" },
  ],

  auth = {
    login: { title: "Login", url: "#" },
  },
}) => {
  // Login Status

  const { isLoggedIn, handleLogout, currentUser } = useContext(AuthContext);

  // Page Content
  return (
    <section className="py-6">
      <div className="block mx-4">
        <div className="flex items-center justify-between">
          <a href={logo.url} className="flex items-center gap-2">
            <img src={logo.src} className="max-h-8" alt={logo.alt} />
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
                <div className="flex flex-row align-center mb-5">
                  <Avatar className="h-12 w-12 mr-5 mt-8">
                    <AvatarImage
                      src={currentUser && currentUser.profileImage}
                      alt={currentUser && currentUser.username}
                    />
                    <AvatarFallback>
                      {currentUser && currentUser.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <SheetDescription className="h-12 mr-5 mt-8 font-bold text-1xl content-center">
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
              <div className="flex flex-col gap-6 px-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-5 mb-3"
                >
                  {isLoggedIn
                    ? menu.map((item) => renderMobileMenuItem(item))
                    : null}
                </Accordion>
                <Separator />
                <div className="flex flex-col gap-3 pt-5">
                  {isLoggedIn ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="mr-8"
                    >
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};
