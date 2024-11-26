import pb from "@/lib/pb";
import { create } from "zustand";
import { Notification } from "@/types/Notification";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const records = await pb
        .collection("notifications")
        .getFullList<Notification>({
          sort: "-created",
          expand: "campaign",
          filter: `to_brand = "${pb.authStore.model?.id}" || to_influencer = "${pb.authStore.model?.id}"`,
        });

      const unread = records.filter((n) => !n.read).length;

      set({
        notifications: records,
        unreadCount: unread,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  },

  markAsRead: async (id) => {
    try {
      await pb.collection("notifications").update(id, { read: true });

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
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  },
}));
