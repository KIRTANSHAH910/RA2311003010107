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
  getNotificationColor,
  formatTimestamp,
} from "../utils/notificationUtils";
import { Log } from "../utils/logger";

const NotificationList = ({ notifications }) => {
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
    Log("frontend", "info", "component", "Notification marked as read");
  };

  if (!notifications || notifications.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", py: 4 }}>
        No notifications found
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {notifications.map((notification, index) => {
        const isFavorite = favorites.includes(notification.ID);
        const priorityPercentage = (notification.priority || 0) * 100;
        const typeColor = getNotificationColor(notification.Type);

        return (
          <Card
            key={notification.ID}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderLeft: `5px solid ${typeColor}`,
              "&:hover": {
                boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                transform: "translateY(-4px)",
              },
              position: "relative",
            }}
          >
            {/* Priority Bar */}
            <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#718096", fontWeight: 600, fontSize: "0.8rem" }}
                >
                  Priority
                </Typography>
                <Tooltip
                  title={`Priority Score: ${(notification.priority * 100).toFixed(1)}%`}
                >
                  <LinearProgress
                    variant="determinate"
                    value={priorityPercentage}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(0,0,0,0.05)",
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${typeColor} 0%, ${typeColor}cc 100%)`,
                      },
                    }}
                  />
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    minWidth: "45px",
                    color: typeColor,
                    fontSize: "0.85rem",
                  }}
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
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${typeColor}22 0%, ${typeColor}44 100%)`,
                    color: typeColor,
                  }}
                >
                  {getTypeIcon(notification.Type)}
                </Box>
              }
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      flex: 1,
                      fontWeight: 700,
                      color: "#2d3748",
                      fontSize: "1.1rem",
                    }}
                  >
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
                      sx={{
                        color: isFavorite ? "#ffd700" : "#cbd5e0",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "#ffd700",
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              subheader={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 1,
                  }}
                >
                  <Chip
                    label={notification.Type}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${typeColor}22 0%, ${typeColor}44 100%)`,
                      color: typeColor,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: "24px",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#a0aec0", fontSize: "0.8rem" }}
                  >
                    {formatTimestamp(notification.Timestamp)}
                  </Typography>
                </Box>
              }
            />

            <CardContent sx={{ pt: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#718096", maxWidth: "75%", fontSize: "0.9rem" }}
                >
                  ID: {notification.ID}
                </Typography>
                <Tooltip title="Mark as read">
                  <button
                    onClick={() => handleMarkAsRead(notification)}
                    style={{
                      padding: "6px 14px",
                      background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}cc 100%)`,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      boxShadow: `0 2px 8px ${typeColor}30`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = `0 4px 12px ${typeColor}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = `0 2px 8px ${typeColor}30`;
                    }}
                  >
                    Mark Read
                  </button>
                </Tooltip>
              </Box>
            </CardContent>

            {/* Rank Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}cc 100%)`,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${typeColor}30`,
              }}
            >
              #{index + 1}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default NotificationList;
