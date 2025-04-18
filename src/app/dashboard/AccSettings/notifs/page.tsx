'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    // Call FastAPI backend to get current settings
    axios.get('http://localhost:8000/user/settings/email-notifications')
      .then((res) => {
        setEmailNotifications(res.data.value ?? false);
      })
      .catch((err) => {
        console.error('Error fetching notification settings:', err);
      });
  }, []);

  const handleToggle = async (value: boolean) => {
    setEmailNotifications(value);

    try {
      await axios.post('http://localhost:8000/user/settings/update', {     //Replaced the default /api/user/settings call with 
        setting: 'emailNotifications',                                     //your FastAPI backend endpoint
        value: value,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Notification Settings</h2>
      <div className="flex items-center justify-between rounded-lg bg-slate-100 p-4">
        <Label>Email Notifications</Label>
        <Switch checked={emailNotifications} onCheckedChange={handleToggle} />
      </div>
    </div>
  );
}