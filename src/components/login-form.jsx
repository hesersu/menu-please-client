// Core imports
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { toast } from "sonner";
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
import { LogIn } from "lucide-react";

export function LoginForm({ className, ...props }) {
  // Login Functionality

  // Setters
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const nav = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  // Handle Login
  async function handleLogin(event) {
    event.preventDefault();
    const userToLogin = { email, password };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        userToLogin
      );
      console.log("user was logged in successfully", res.data);
      localStorage.setItem("authToken", res.data.authToken);
      nav("/");
      return authenticateUser();
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.errorMessage || "Login failed");
      toast.error(err.response?.data?.errorMessage || "Login failed")
    }
  }

  // This returns the component

  return (
      <Card className="bg-card text-card-foreground w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-5">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  <LogIn/> Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
