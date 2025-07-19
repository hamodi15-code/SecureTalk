
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User } from 'lucide-react';
import MFASettings from '@/components/auth/MFASettings';
import E2EESetup from '@/components/auth/E2EESetup';
import ChatLayout from '@/components/chat/ChatLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';

const Settings: React.FC = () => {
  return (
    <ChatLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="mt-6 space-y-6">
              <E2EESetup />
              <MFASettings />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <ProfileSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ChatLayout>
  );
};

export default Settings;
