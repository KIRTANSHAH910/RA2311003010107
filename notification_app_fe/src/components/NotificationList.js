import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Chip,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Work as PlacementIcon,
  EmojiEvents as ResultIcon,
  EventAvailable as EventIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import {
  getNotificationIcon,
  getNotificationColor,
  formatTimestamp,
} from "../utils/notificationUtils";
import { Log } from "../utils/logger";

function NotificationList({ notifications }) {
  const [favorites, setFavorites] = React.useState([]);

  const getTypeIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (type) {
      case "Placement":
        return <PlacementIcon {...iconProps} />;
      case "Result":
        return <ResultIcon {...iconProps} />;
      case "Event":
        return <EventIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const handleFavorite = (notificationId) => {
    setFavorites((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId],
    );
    Log(
      "frontend",
      "info",
      "component",
      `Notification ${notificationId} favorited`,
    );
  };

  const handleMarkAsRead = (notification) => {
    Log("frontend", "info", "component", `Notification marked as read`);
  };

  if (!notifications || notifications.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
        No notifications to display
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {notifications.map((notification, index) => {
        const isFavorite = favorites.includes(notification.ID);
        const priorityPercentage = (notification.priority || 0) * 100;
        const typeColor = getNotificationColor(notification.Type);

        return (
          <Card
            key={notification.ID}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
              },
              borderLeft: `4px solid ${typeColor}`,
              position: "relative",
            }}
          >
            {/* Priority Indicator */}
            <Box sx={{ px: 2, pt: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography variant="caption" sx={{ color: "#999" }}>
                  Priority Score
                </Typography>
                <Tooltip
                  title={`Priority: ${(notification.priority * 100).toFixed(1)}%`}
                >
                  <LinearProgress
                    variant="determinate"
                    value={priorityPercentage}
                    sx={{ flex: 1, height: 6, borderRadius: 3 }}
                  />
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", minWidth: "40px" }}
                >
                  {(notification.priority * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Box>

            <CardHeader
              avatar={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: typeColor + "20",
                    color: typeColor,
                  }}
                >
                  {getTypeIcon(notification.Type)}
                </Box>
              }
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {notification.Message}
                  </Typography>
                  <Tooltip
                    title={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleFavorite(notification.ID)}
                      sx={{ color: isFavorite ? "warning.main" : "inherit" }}
                    >
                      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              subheader={
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Chip
                    label={notification.Type}
                    size="small"
                    sx={{
                      backgroundColor: typeColor + "20",
                      color: typeColor,
                      fontWeight: "bold",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {formatTimestamp(notification.Timestamp)}
                  </Typography>
                </Box>
              }
            />

            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666", maxWidth: "80%" }}
                >
                  ID: {notification.ID}
                </Typography>
                <Tooltip title="Mark as read">
                  <button
                    onClick={() => handleMarkAsRead(notification)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: typeColor,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                      transition: "opacity 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    Mark Read
                  </button>
                </Tooltip>
              </Box>
            </CardContent>

            {/* Ranking Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: typeColor,
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              #{index + 1}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}

export default NotificationList;
