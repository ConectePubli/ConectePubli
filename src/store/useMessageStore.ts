import { create } from "zustand";
import { getUnreadConversationsCount } from "@/services/chatService";

type MessageStore = {
  unreadConversationsCount: number;
  fetchUnreadConversationsCount: (userType: string) => Promise<void>;
  decrementUnreadConversationsCount: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  unreadConversationsCount: 0,
  fetchUnreadConversationsCount: async (userType: string) => {
    const count = await getUnreadConversationsCount(userType);
    set({ unreadConversationsCount: count });
  },
  decrementUnreadConversationsCount: () => {
    set((state) => ({
      unreadConversationsCount: Math.max(0, state.unreadConversationsCount - 1),
    }));
  },
}));
