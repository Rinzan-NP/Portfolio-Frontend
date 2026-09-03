import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isOpen: boolean;
  isAiReady: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  startAiAgent: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiReady, setIsAiReady] = useState(false);

  return (
    <ChatContext.Provider value={{
      isOpen,
      isAiReady,
      openChat: () => setIsOpen(true),
      closeChat: () => setIsOpen(false),
      toggleChat: () => setIsOpen(v => !v),
      startAiAgent: () => {
        setIsAiReady(true);
        setIsOpen(true);
      },
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
