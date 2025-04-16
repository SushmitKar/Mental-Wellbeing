'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { jwtDecode } from 'jwt-decode';
import { Menu, User } from "lucide-react";


interface DecodedToken {
  user_id: string;
  email: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");  
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(storedToken);
      if (!decoded?.user_id) throw new Error("Invalid token");

      setUserId(decoded.user_id);
      setEmail(decoded.email);

      fetch(`http://localhost:8000/get_profile/${decoded.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setBio(data.bio || "");
          setAvatarPreview(data.avatar || null);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          toast.error("Could not load profile details.");
        });
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("token");
      toast.error("Invalid session. Please log in again.");
      router.push("/login");
    }
  }, [router]);

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      const response = await fetch("http://localhost:8000/update_profile", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      router.push("/dashboard/profile");
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be under 2MB.");
      return;
    }

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b shadow-sm bg-gradient-to-r from-purple-50 to-white lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <h1 className="text-xl font-bold text-purple-700">Account Settings</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-100 transition">
          <User className="h-5 w-5 text-purple-600" />
          <span className="sr-only">User Menu</span>
        </Button>
      </div>

  
      {/* Profile Card */}
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium mb-1">First Name</label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                disabled={loading}
              />
            </div>
  
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium mb-1">Last Name</label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                disabled={loading}
              />
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
  
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                disabled={loading}
              />
            </div>
  
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium mb-1">Avatar</label>
              <div className="flex justify-center mb-4">
                <img
                  src={avatarPreview || "/default-avatar.png"}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-100 hover:file:bg-gray-200"
              />
            </div>
  
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.push("/dashboard/profile")} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !userId}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  ); 
}