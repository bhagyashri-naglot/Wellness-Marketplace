import { markNotificationAsRead } from "../../api/notificationApi";
import { markNotificationAsRead } from "../../api/notificationApi";

const handleMarkRead = async () => {
  await markNotificationAsRead(notification.id);
  refresh();
};


const NotificationItem = ({ notification, refresh }) => {
  const handleMarkRead = async () => {
    try {
      await markNotificationAsRead(notification.id);
      refresh();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div
      className={`p-4 mb-3 rounded border ${
        notification.read ? "bg-gray-100" : "bg-blue-100"
      }`}
    >
      <p className="font-medium">{notification.message}</p>

      <div className="flex justify-between items-center mt-2">
        <small className="text-gray-600">{notification.type}</small>

        {!notification.read && (
          <button
            onClick={handleMarkRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
