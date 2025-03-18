"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState(""); // ✅ Change username → email
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    const response = await fetch("http://127.0.0.1:8000/signin", {  // ✅ Fix API URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),  // ✅ Change username → email
    });

    const data = await response.json

    if (response.ok) {
      alert("Login Successful!");
      router.push("/dashboard");  // ✅ Redirects to Dashboard
    } else {
      const errorData = await response.json();
      alert("Error: " + (errorData.detail || "Invalid email or password"));
    }
  };


  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Sign in to MindHub</CardTitle>
            <CardDescription>Start your mental wellness journey today!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}   // ✅ Connect state to input
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}   // ✅ Connect state to input
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSignIn}>
              Sign In
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
