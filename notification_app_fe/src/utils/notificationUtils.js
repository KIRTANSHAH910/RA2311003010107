import axios from "axios";

const API_BASE_URL = "http://20.207.122.201/evaluation-service/notifications";

/**
 * Fetch notifications from the API
 */
export const fetchNotifications = async (
  limit = 10,
  page = 1,
  notificationType = "",
) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    if (notificationType) {
      params.append("notification_type", notificationType);
    }

    const url = `${API_BASE_URL}?${params.toString()}`;
    const response = await axios.get(url);

    if (
      response.status === 200 &&
      response.data &&
      response.data.notifications
    ) {
      return response.data.notifications;
    }
    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Calculate priority score for a notification
 * Formula: (typeWeight × 0.6) + (recencyScore × 0.4) × (isUnread ? 1.2 : 1.0)
 */
export const calculatePriority = (notification) => {
  try {
    // Type weights
    const typeWeights = {
      Placement: 0.9,
      Result: 0.7,
      Event: 0.5,
    };

    const typeWeight = typeWeights[notification.Type] || 0.5;

    // Calculate hours since notification
    const notificationTime = new Date(notification.Timestamp).getTime();
    const currentTime = new Date().getTime();
    const hoursSince = (currentTime - notificationTime) / (1000 * 60 * 60);

    // Recency score using exponential decay
    const recencyScore = Math.exp(-(hoursSince / 24));

    // Calculate base priority
    const basePriority = typeWeight * 0.6 + recencyScore * 0.4;

    // Apply unread boost (assuming unread if not explicitly marked as read)
    const isUnread = !notification.isRead;
    const finalPriority = basePriority * (isUnread ? 1.2 : 1.0);

    return parseFloat(finalPriority.toFixed(4));
  } catch (error) {
    console.error("Error calculating priority:", error);
    return 0;
  }
};

/**
 * Filter and sort notifications by priority
 */
export const filterAndSortNotifications = (notifications, filterType = "") => {
  try {
    let filtered = notifications;

    // Apply type filter if specified
    if (filterType) {
      filtered = notifications.filter((n) => n.Type === filterType);
    }

    // Sort by priority (descending)
    filtered.sort((a, b) => {
      const priorityA = a.priority || calculatePriority(a);
      const priorityB = b.priority || calculatePriority(b);
      return priorityB - priorityA;
    });

    return filtered;
  } catch (error) {
    console.error("Error filtering notifications:", error);
    return notifications;
  }
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type) => {
  const iconMap = {
    Placement: "💼",
    Result: "📊",
    Event: "📅",
  };
  return iconMap[type] || "📬";
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type) => {
  const colorMap = {
    Placement: "#e91e63", // Pink
    Result: "#2196f3", // Blue
    Event: "#ff9800", // Orange
  };
  return colorMap[type] || "#757575";
};

/**
 * Format timestamp to readable format
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return timestamp;
  }
};
