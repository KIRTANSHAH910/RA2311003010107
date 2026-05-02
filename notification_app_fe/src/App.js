import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  EventAvailable as EventIcon,
  EmojiEvents as ResultIcon,
  Work as PlacementIcon,
} from "@mui/icons-material";
import NotificationList from "./components/NotificationList";
import {
  fetchNotifications,
  calculatePriority,
  filterAndSortNotifications,
} from "./utils/notificationUtils";
import { Log, initializeLogger, logApi } from "./utils/logger";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  // Fetch notifications on component mount and when parameters change
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        Log(
          "frontend",
          "info",
          "api",
          `Fetching notifications - limit: ${limit}, type: ${filterType}`,
        );

        // Fetch all notifications (API doesn't have server-side pagination with priority)
        const data = await fetchNotifications(limit, 1, filterType);

        // Calculate priority for each notification
        const notificationsWithPriority = data.map((notification) => ({
          ...notification,
          priority: calculatePriority(notification),
        }));

        // Filter and sort by priority
        const processed = filterAndSortNotifications(
          notificationsWithPriority,
          filterType,
        );

        setNotifications(processed);
        Log(
          "frontend",
          "info",
          "api",
          `Loaded ${processed.length} notifications`,
        );

        // Calculate pagination
        const pages = Math.ceil(processed.length / limit);
        setTotalPages(pages);
        setCurrentPage(1);
      } catch (err) {
        Log("frontend", "error", "api", `Failed to fetch: ${err.message}`);
        setError(`Failed to load notifications: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [limit, filterType]);

  // Get paginated notifications
  const getPaginatedNotifications = () => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return notifications.slice(startIndex, endIndex);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    Log("frontend", "info", "state", `Limit changed to ${newLimit}`);
  };

  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    setCurrentPage(1);
    Log("frontend", "info", "state", `Filter changed to ${type || "all"}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    Log("frontend", "info", "state", `Page changed to ${value}`);
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    Log("frontend", "info", "component", "Refresh clicked");
    setCurrentPage(1);
  };

  const paginatedNotifications = getPaginatedNotifications();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <NotificationsIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <div>
          <h1 style={{ margin: "0 0 8px 0" }}>Campus Notifications</h1>
          <p style={{ margin: 0, color: "#666" }}>
            Stay updated with important announcements and updates
          </p>
        </div>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f9f9f9" }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={handleFilterTypeChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Limit per Page</InputLabel>
              <Select
                value={limit.toString()}
                label="Limit per Page"
                onChange={handleLimitChange}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          icon={<PlacementIcon />}
          label={`${notifications.filter((n) => n.Type === "Placement").length} Placements`}
          color={filterType === "Placement" ? "primary" : "default"}
          variant="outlined"
        />
        <Chip
          icon={<ResultIcon />}
          label={`${notifications.filter((n) => n.Type === "Result").length} Results`}
          color={filterType === "Result" ? "primary" : "default"}
          variant="outlined"
        />
        <Chip
          icon={<EventIcon />}
          label={`${notifications.filter((n) => n.Type === "Event").length} Events`}
          color={filterType === "Event" ? "primary" : "default"}
          variant="outlined"
        />
        <Chip label={`Total: ${notifications.length}`} variant="filled" />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Notifications List */}
      {!loading && (
        <>
          {paginatedNotifications.length > 0 ? (
            <>
              <NotificationList notifications={paginatedNotifications} />

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              No notifications found
            </Alert>
          )}
        </>
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
        }}
      >
        <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
          Refresh Notifications
        </Button>
        <p style={{ marginTop: "16px", color: "#999", fontSize: "12px" }}>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </Box>
    </Container>
  );
}

export default App;
