import { create } from "zustand";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
  markAsRead: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Você recebeu uma nova mensagem.",
    time: "Há 2 horas",
    read: false,
  },
  {
    id: "2",
    message: "Sua publicação foi aprovada.",
    time: "Há 4 horas",
    read: true,
  },
];

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: () => {
    // Simule uma chamada à API
    // TODO: integrar com o backend
    set(() => {
      const unread = mockNotifications.filter((n) => !n.read).length;
      return {
        notifications: mockNotifications,
        unreadCount: unread,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unread = updatedNotifications.filter((n) => !n.read).length;
      return {
        notifications: updatedNotifications,
        unreadCount: unread,
      };
    });

    // TODO: Enviar atualização para o backend (PocketBase)
    // Exemplo:
    // fetch(`/api/notifications/${id}/mark-as-read`, { method: 'POST' });
  },
}));
