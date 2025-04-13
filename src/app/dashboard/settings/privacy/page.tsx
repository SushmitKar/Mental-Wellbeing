'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setMessage('Invalid session. Please log in again.');
      }
    }
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    if (!userId) {
      setMessage('User not authenticated.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post("http://localhost:8000/change_password", {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.data.message) {
        setMessage(res.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage('Something went wrong.');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Change Password</h2>
      <div className="space-y-2">
        <Label>Current Password</Label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Label>New Password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Label>Confirm New Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handlePasswordChange} disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
        {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
}