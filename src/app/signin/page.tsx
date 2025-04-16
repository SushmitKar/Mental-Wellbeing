'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [role, setRole] = useState("customer");

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // Include the role
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Invalid email or password");
      }

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        localStorage.setItem("token", data.user.token); // Save token if needed
        localStorage.setItem("role", data.user.role);

        if(data.user.role === "therapist") {
          router.push("/dashboard/therapist")
        }else{
          router.push("/dashboard")
        }
      } else {
        // Handle error response
        alert("Error: " + (data.detail || "Invalid email or password"));
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };

  const handleRoleSwitch = (role: string) => {
    setRole(role);
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
            {/* Tabs for switching between Customer and Therapist */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  role === "customer" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={() => handleRoleSwitch("customer")}
              >
                Customer
              </button>
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  role === "therapist" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={() => handleRoleSwitch("therapist")}
              >
                Therapist
              </button>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign In Button */}
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSignIn}>
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
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
