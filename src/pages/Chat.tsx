
import React, { useState } from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import ChatTabs from '@/components/chat/ChatTabs';
import ChatMessages from '@/components/chat/ChatMessages';
import { useToast } from '@/hooks/use-toast';
import { useUserPresence } from '@/hooks/useUserPresence';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import { useChatLogic } from '@/hooks/useChatLogic';
import { useGroupChat } from '@/hooks/useGroupChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { UserPresence } from '@/types/userPresence';

const Chat: React.FC = () => {
  const { toast } = useToast();
  const { onlineUsers } = useUserPresence();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('chats');

  const { 
    conversations, 
    loading: conversationsLoading,
    error: conversationsError,
    startChat, 
    getConversationName,
    fetchConversations
  } = useChatLogic();

  const { createGroupChat } = useGroupChat(fetchConversations);

  const { 
    messages, 
    loading: messagesLoading, 
    error: messagesError,
    sendMessage
  } = useRealTimeMessages(selectedConversation);

  const handleStartChat = async (userId: string, userName: string) => {
    try {
      const conversationId = await startChat(userId, userName);
      setSelectedConversation(conversationId);
      setActiveTab('chats');
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const handleCreateGroup = async (groupName: string, selectedUserIds: string[]) => {
    try {
      const conversationId = await createGroupChat(groupName, selectedUserIds);
      setSelectedConversation(conversationId);
      setActiveTab('chats');
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error; // Re-throw to let GroupCreationModal handle the error toast
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      throw error;
    }
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((u: UserPresence) => u.user_id === userId && u.is_online);
  };

  if (conversationsLoading) {
    return (
      <ChatLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading conversations...</p>
          </div>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <div className="flex flex-col md:flex-row h-full">
        {/* Mobile-first responsive sidebar */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 lg:w-1/4 xl:w-1/3`}>
          <ChatTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            conversations={conversations}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            onlineUsers={onlineUsers}
            onStartChat={handleStartChat}
            onCreateGroup={handleCreateGroup}
            getConversationName={getConversationName}
            isUserOnline={isUserOnline}
          />
        </div>

        {/* Mobile-first responsive chat area */}
        <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
          {conversationsError && (
            <div className="p-3 sm:p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{conversationsError}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <ChatMessages
            selectedConversation={selectedConversation}
            conversations={conversations}
            messages={messages}
            messagesLoading={messagesLoading}
            getConversationName={getConversationName}
            onSendMessage={handleSendMessage}
            error={messagesError}
          />
        </div>
      </div>
    </ChatLayout>
  );
};

export default Chat;
