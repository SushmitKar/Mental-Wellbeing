'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "therapist">("customer");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("role", data.user.role);
        alert("Sign up successful!");
  
        router.push(
          data.user.role === "therapist" ? "/dashboard/therapist" : "/dashboard"
        );
      } else {
        alert("Error: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Signup error:", error);
    }
  };  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Start your mental wellness journey today!</CardDescription>
        </CardHeader>

        {/* Role Tabs */}
        <div className="flex justify-center gap-4 pb-2">
          <button
            onClick={() => setRole("customer")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              role === "customer" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole("therapist")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              role === "therapist" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            Therapist
          </button>
        </div>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSignUp}>
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M17.13 17.21c-.62-.69-1.43-1.08-2.85-1.08h-4.56c-1.42 0-2.23.39-2.85 1.08" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}