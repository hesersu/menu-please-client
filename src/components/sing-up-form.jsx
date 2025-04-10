import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function SignUpForm({
  className,
  ...props
}) {
    //Functionality to sign up a new user
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    //function to send a post request to create a user in the DB
    function handleSignup(event) {
      //first is to stop the page from reloading
      event.preventDefault();
      const userToCreateInDB = { username, email, password: password };
      console.log(userToCreateInDB)
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/signup`, userToCreateInDB)
        .then((res) => {
          console.log("user created in the DB", res);
          nav("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>
          <CardDescription>
            Enter your username, email and password below to create to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input 
                id="username" 
                type="string" 
                placeholder="username" 
                required 
                value={username}
                onChange = {(e)=>{setUsername(e.target.value)}}  />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required
                value={email}
                onChange = {(e)=>{setEmail(e.target.value)}} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange = {(e)=>{setPassword(e.target.value)}}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign-up
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
            <Link to="/Login" className="underline underline-offset-4">
                Login
            </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
