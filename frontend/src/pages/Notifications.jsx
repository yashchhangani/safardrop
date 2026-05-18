import { useEffect, useState } from "react";
import { getStoredUser, notificationService } from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationsByUser(user?.userId);
        setNotifications(data || []);
        setError("");
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.userId]);

  if (loading) {
    return <p className="text-center mt-12 text-slate-600">Loading notifications...</p>;
  }

  if (error) {
    return <p className="text-center mt-12 text-red-500">{error}</p>;
  }

  if (notifications.length === 0) {
    return <p className="text-center mt-12 text-slate-500">No notifications yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-4">
      <h1 className="text-3xl font-bold mb-6">Traveller Notifications</h1>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <div key={notification.notificationId} className="border rounded-2xl p-5 shadow-sm bg-white">
            <p className="text-xs uppercase tracking-wide text-blue-600 font-bold mb-2">
              {notification.type.replaceAll("_", " ")}
            </p>
            <p className="text-slate-800">{notification.message}</p>
            <p className="mt-3 text-sm text-slate-400">
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
