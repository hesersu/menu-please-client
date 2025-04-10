import React from "react";
import axios from "axios";
import { useContext, useState } from "react";

// Shadcn Component Import
import { LoginForm } from "@/components/login-form";

// Function

export const LoginPage = () => {
  // Content of the Page
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};
