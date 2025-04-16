'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, ClipboardList, Phone, Settings, Users } from "lucide-react";
import PatientsOverview from './patients';
import Appointments from './appointments';
import SessionNotes from './notes';
import Settings from './settings';
import Notifications from './notifications';
import Calls from './calls';

export default function TherapistDashboard() {
  const [activeTab, setActiveTab] = useState('patients');
  const [therapistData, setTherapistData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch therapist data
    const fetchTherapistData = async () => {
      try {
        const response = await fetch('/api/therapist/profile');
        if (response.ok) {
          const data = await response.json();
          setTherapistData(data);
        }
      } catch (error) {
        console.error('Error fetching therapist data:', error);
      }
    };

    fetchTherapistData();
  }, []);

  if (!therapistData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={therapistData.avatar} />
                <AvatarFallback>{therapistData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dr. {therapistData.name}</h1>
                <p className="text-sm text-gray-500">{therapistData.specialization}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid grid-cols-6 gap-4">
            <TabsTrigger value="patients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Patients</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Calls</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <PatientsOverview therapistId={therapistData._id} />
          </TabsContent>

          <TabsContent value="appointments">
            <Appointments therapistId={therapistData._id} />
          </TabsContent>

          <TabsContent value="notes">
            <SessionNotes therapistId={therapistData._id} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings therapistId={therapistData._id} />
          </TabsContent>

          <TabsContent value="notifications">
            <Notifications therapistId={therapistData._id} />
          </TabsContent>

          <TabsContent value="calls">
            <Calls therapistId={therapistData._id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}