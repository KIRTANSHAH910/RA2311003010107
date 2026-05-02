import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
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
  RefreshOutlined as RefreshIcon,
} from "@mui/icons-material";
import NotificationList from "./components/NotificationListNew";
import {
  fetchNotifications,
  calculatePriority,
  filterAndSortNotifications,
} from "./utils/notificationUtils";
import { Log, initializeLogger } from "./utils/logger";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  // Initialize logger with credentials
  useEffect(() => {
    initializeLogger(
      "1cab4f98-d329-421e-a8e7-78d2a646b7aa",
      "hPYJGPebPpNhdvnN",
    );
    Log("frontend", "info", "page", "App initialized");
  }, []);

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

        const data = await fetchNotifications(limit, 1, filterType);

        const notificationsWithPriority = data.map((notification) => ({
          ...notification,
          priority: calculatePriority(notification),
        }));

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
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            animation: "fadeIn 0.8s ease",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Box>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "#2d3748",
              }}
            >
              Campus Notifications
            </h1>
            <p
              style={{
                margin: 0,
                color: "#718096",
                fontSize: "0.95rem",
              }}
            >
              Stay informed with important updates and announcements
            </p>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Controls Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#4a5568" }}>
                  Filter by Type
                </InputLabel>
                <Select
                  value={filterType}
                  label="Filter by Type"
                  onChange={handleFilterTypeChange}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
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
                <InputLabel sx={{ color: "#4a5568" }}>
                  Items Per Page
                </InputLabel>
                <Select
                  value={limit.toString()}
                  label="Items Per Page"
                  onChange={handleLimitChange}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
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

        {/* Statistics */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            animation: "fadeIn 0.8s ease",
          }}
        >
          <Chip
            icon={<PlacementIcon />}
            label={`${notifications.filter((n) => n.Type === "Placement").length} Placements`}
            sx={{
              borderRadius: "8px",
              height: "40px",
              fontSize: "0.95rem",
              fontWeight: 600,
              background:
                filterType === "Placement"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.9)",
              color: filterType === "Placement" ? "white" : "#2d3748",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border:
                filterType === "Placement"
                  ? "none"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          />
          <Chip
            icon={<ResultIcon />}
            label={`${notifications.filter((n) => n.Type === "Result").length} Results`}
            sx={{
              borderRadius: "8px",
              height: "40px",
              fontSize: "0.95rem",
              fontWeight: 600,
              background:
                filterType === "Result"
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "rgba(255, 255, 255, 0.9)",
              color: filterType === "Result" ? "white" : "#2d3748",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border:
                filterType === "Result" ? "none" : "1px solid rgba(0,0,0,0.1)",
            }}
          />
          <Chip
            icon={<EventIcon />}
            label={`${notifications.filter((n) => n.Type === "Event").length} Events`}
            sx={{
              borderRadius: "8px",
              height: "40px",
              fontSize: "0.95rem",
              fontWeight: 600,
              background:
                filterType === "Event"
                  ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  : "rgba(255, 255, 255, 0.9)",
              color: filterType === "Event" ? "white" : "#2d3748",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border:
                filterType === "Event" ? "none" : "1px solid rgba(0,0,0,0.1)",
            }}
          />
          <Chip
            label={`Total: ${notifications.length}`}
            sx={{
              borderRadius: "8px",
              height: "40px",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
          />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress
              sx={{
                color: "#667eea",
                width: "50px !important",
                height: "50px !important",
              }}
            />
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
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(102, 126, 234, 0.1)",
                            transform: "scale(1.05)",
                          },
                          "&.Mui-selected": {
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Alert
                severity="info"
                sx={{
                  mt: 3,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                No notifications found. Try adjusting your filters.
              </Alert>
            )}
          </>
        )}

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              borderRadius: "10px",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              color: "white",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.5)",
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            Refresh Notifications
          </Button>
          <p style={{ marginTop: "20px", color: "#718096", fontSize: "14px" }}>
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
