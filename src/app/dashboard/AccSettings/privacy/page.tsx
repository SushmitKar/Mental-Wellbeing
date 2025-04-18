'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import zxcvbn from 'zxcvbn';
import { Menu, User } from "lucide-react";

type TokenPayload = {
  user_id: string;
  email: string;
  exp: number;
};

export default function PrivacySettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setMessage('Invalid session. Please log in again.');
        setIsError(true);
      }
    }
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      setIsError(true);
      return;
    }

    if (!userId) {
      setMessage('User not authenticated.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await axios.post("http://localhost:8000/change_password", {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.data.message) {
        setMessage(res.data.message);
        setIsError(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength(null); // Reset
      } else {
        setMessage('Something went wrong.');
        setIsError(true);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Something went wrong.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(null);
    }
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
          <h1 className="text-xl font-bold text-purple-700">Privacy Settings</h1>
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
            <CardTitle className="text-2xl text-purple-600">Change Password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>

            {/* Password Strength Indicator */}
            {passwordStrength !== null && (
              <p className={`text-sm ${passwordStrength < 2 ? 'text-red-500' : passwordStrength < 4 ? 'text-yellow-500' : 'text-green-600'}`}>
                {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Moderate' : 'Strong'}
              </p>
            )}

            {/* Show/Hide Password Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-sm text-purple-500 p-0"
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </Button>
            </div>

            <Button 
              onClick={handlePasswordChange} 
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>

            {message && (
              <p className={`text-sm mt-3 text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}