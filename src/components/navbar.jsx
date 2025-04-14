import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

export const Navbar = ({
  logo = {
    url: "/",
    src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },

  menu = [
    { title: `Add Menu`, url: "#" },
    { title: "History", url: "#" },
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
    <section className="py-4">
      <div>
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {isLoggedIn ? menu.map((item) => renderMenuItem(item)) : null}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
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
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild className="mr-4">
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-light text-sm"></SheetTitle>
                  <div className="flex flex-row align-center mb-5">
                    <Avatar className="h-12 w-12 mr-5 mt-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {currentUser && currentUser.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <SheetDescription className="h-12 mr-5 mt-8 font-normal text-1xl text-white content-center">
                      Welcome, {currentUser && currentUser.username}!
                    </SheetDescription>
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
      </div>
    </section>
  );
};

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};
