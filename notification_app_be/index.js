const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Store logs in memory
const logs = [];

/**
 * Logging Middleware
 * Logs all incoming requests and application events
 */
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.body,
  };

  logs.push(logEntry);

  // Limit logs to 1000 entries
  if (logs.length > 1000) {
    logs.shift();
  }

  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(loggingMiddleware);

/**
 * Health Check Endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Logs Endpoint - Get application logs
 */
app.get("/logs", (req, res) => {
  const level = req.query.level;
  const limit = parseInt(req.query.limit) || 100;

  let filteredLogs = logs;

  if (level) {
    filteredLogs = logs.filter((log) => log.level === level);
  }

  const paginatedLogs = filteredLogs.slice(-limit);

  res.json({
    count: paginatedLogs.length,
    logs: paginatedLogs,
  });
});

/**
 * Clear Logs Endpoint - Clear application logs
 */
app.post("/logs/clear", (req, res) => {
  logs.length = 0;
  res.json({
    message: "Logs cleared successfully",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Log Action Endpoint - Custom log entry
 */
app.post("/logs/action", (req, res) => {
  const { level = "info", message, data = {} } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    source: "custom",
  };

  logs.push(logEntry);

  if (logs.length > 1000) {
    logs.shift();
  }

  console.log(`[${level.toUpperCase()}] ${message}`, data);

  res.json({
    success: true,
    logEntry,
  });
});

/**
 * Statistics Endpoint - Get statistics about requests
 */
app.get("/stats", (req, res) => {
  const stats = {
    totalLogs: logs.length,
    requestMethods: {},
    requestUrls: {},
  };

  logs.forEach((log) => {
    stats.requestMethods[log.method] =
      (stats.requestMethods[log.method] || 0) + 1;
    stats.requestUrls[log.url] = (stats.requestUrls[log.url] || 0) + 1;
  });

  res.json(stats);
});

/**
 * Priority Calculator Endpoint
 */
app.post("/calculate-priority", (req, res) => {
  const { notification } = req.body;

  if (!notification || !notification.Type || !notification.Timestamp) {
    return res.status(400).json({
      error: "Invalid notification object",
    });
  }

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

    // Apply unread boost
    const isUnread = !notification.isRead;
    const finalPriority = basePriority * (isUnread ? 1.2 : 1.0);

    res.json({
      notificationId: notification.ID,
      typeWeight,
      recencyScore: parseFloat(recencyScore.toFixed(4)),
      basePriority: parseFloat(basePriority.toFixed(4)),
      unreadBoost: isUnread ? 1.2 : 1.0,
      finalPriority: parseFloat(finalPriority.toFixed(4)),
    });
  } catch (error) {
    res.status(500).json({
      error: "Error calculating priority",
      message: error.message,
    });
  }
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.url,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Logs: http://localhost:${PORT}/logs`);
  console.log(`Stats: http://localhost:${PORT}/stats`);
});

module.exports = app;
