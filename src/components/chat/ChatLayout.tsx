
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b px-3 sm:px-4 py-3 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/chat")}>
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-lg font-bold hidden sm:block">SecureTalk</h1>
          <h1 className="text-base font-bold sm:hidden">ST</h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default ChatLayout;
