import api from "../api/api";

const notificationService = {
  getMyNotifications: async (unreadOnly = false, limit = 50) => {
    const { data } = await api.get("/notifications", {
      params: { unreadOnly, limit },
    });
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get("/notifications/unread-count");
    return data?.unreadCount ?? 0;
  },

  markAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    const { data } = await api.patch("/notifications/read-all");
    return data?.markedCount ?? 0;
  },

  registerDeviceToken: async ({ platform = "web", expoPushToken, deviceId }) => {
    const { data } = await api.post("/notifications/device-token", {
      platform,
      expoPushToken,
      deviceId,
    });
    return data;
  },

  sendNotification: async (payload) => {
    const { data } = await api.post("/notifications/send", payload);
    return data;
  },
};

export default notificationService;
