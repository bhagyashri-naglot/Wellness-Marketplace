import api from "./axios";

// Get all notifications for logged-in user
export const getNotifications = () => {
  return api.get("/notifications");
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};
