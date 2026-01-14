import { useEffect, useState } from "react";
import { getNotifications } from "../../api/notificationApi";
import NotificationItem from "./NotificationItem";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications available</p>
      )}

      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          refresh={loadNotifications}
        />
      ))}
    </div>
  );
};

export default NotificationList;
