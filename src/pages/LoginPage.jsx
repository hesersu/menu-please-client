import React from "react";
import axios from "axios";
import { useContext, useState } from "react";

// Shadcn Component Import
import { LoginForm } from "@/components/login-form";

// Function

export const LoginPage = () => {
  // Content of the Page
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 md:px-10">
        <LoginForm />
    </div>
  );
};
