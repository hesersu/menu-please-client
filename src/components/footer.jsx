import { Info, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="border-t py-6 mx-4 mt-3">
        <div className="container flex flex-row items-center justify-between gap-2 lg:mx-auto">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Menu, Please!
          </p>
          <nav className="flex gap-4 text-sm">
            <Link
              to="/about-us"
              className="text-muted-foreground hover:text-foreground"
            >
              About us
            </Link>
            <a
              href="mailto:hi.menu.please@gmail.com"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact us
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Footer;
