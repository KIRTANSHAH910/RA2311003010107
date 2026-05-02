# Logging Middleware

Comprehensive logging middleware for the Campus Notification System. Provides structured logging across frontend and backend applications.

## Overview

The logging middleware provides:

- **Structured Logging**: Consistent log format across applications
- **Multiple Log Levels**: info, error, warn, debug
- **Action Tracking**: Track user actions and application events
- **Performance Monitoring**: Log operation durations
- **API Call Logging**: Track external API requests
- **Error Logging**: Capture and log errors with context

## Usage

### Frontend Integration

```javascript
import { logAction, logNotificationEvent } from "../utils/logger";

// Log a simple action
logAction("info", "User viewed notification", {
  notificationId: "notif123",
});

// Log a notification event
logNotificationEvent("marked_as_read", notification);

// Log an API call
logApiCall("GET", "/notifications", 200);

// Log performance metric
logPerformance("calculatePriority", 2.5);
```

### Backend Integration

```javascript
const loggingMiddleware = (req, res, next) => {
  // Automatically logs all incoming requests
  next();
};

app.use(loggingMiddleware);

// Custom log via POST endpoint
app.post("/logs/action", (req, res) => {
  const { level, message, data } = req.body;
  // Logs are stored and can be retrieved
});
```

## Log Entry Structure

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "Descriptive action message",
  "data": {
    "userId": "user123",
    "additionalContext": "value"
  },
  "source": "frontend|backend|custom"
}
```

## Log Levels

| Level   | Usage                                      | Color  |
| ------- | ------------------------------------------ | ------ |
| `info`  | General information about application flow | Blue   |
| `error` | Error messages                             | Red    |
| `warn`  | Warning messages                           | Orange |
| `debug` | Debug information                          | Gray   |

## Features

### 1. Action Logging

Log user actions like navigation, filters, refreshes:

```javascript
logAction("info", "Filter changed", {
  filterType: "Placement",
  oldFilter: "Event",
});
```

### 2. Event Logging

Track specific application events:

```javascript
logNotificationEvent("favorite", notification, {
  previousValue: false,
  newValue: true,
});
```

### 3. API Logging

Track external API calls:

```javascript
logApiCall("GET", "/evaluation-service/notifications", 200);
logApiCall("POST", "/logs/action", 201, null);
logApiCall("GET", "/evaluation-service/notifications", 500, error);
```

### 4. Performance Logging

Track operation durations:

```javascript
const start = performance.now();
// ... perform operation ...
const duration = performance.now() - start;
logPerformance("fetchNotifications", duration);
```

### 5. Error Logging

Capture errors with context:

```javascript
try {
  // ... code that might error ...
} catch (error) {
  logAction("error", "Failed to process notification", {
    error: error.message,
    stack: error.stack,
    context: "calculatePriority",
  });
}
```

## Configuration

### Frontend Logger Configuration

```javascript
import logger, { logAction, getLogger } from "./utils/logger";

// Access logger instance for advanced usage
const loggerInstance = getLogger();

// Get all logs
const allLogs = loggerInstance.getLogs();

// Get logs by level
const errorLogs = loggerInstance.getLogs("error");

// Export logs
const logsJson = loggerInstance.exportLogs();

// Clear logs
loggerInstance.clearLogs();
```

### Backend Logger Configuration

Configure via environment variables in `.env`:

```env
LOG_LEVEL=info
LOG_MAX_SIZE=1000
```

## Log Retrieval

### Frontend

Logs are stored in memory and can be accessed via:

```javascript
const logger = getLogger();
console.log(logger.getLogs());
```

### Backend

Retrieve logs via API endpoints:

```bash
# Get all logs
curl http://localhost:5000/logs

# Get last 50 logs
curl http://localhost:5000/logs?limit=50

# Get error logs only
curl http://localhost:5000/logs?level=error
```

## Monitoring and Debugging

### View Logs in Browser Console

Frontend logs are automatically printed to the browser console with color coding and timestamps.

### Export Logs

```javascript
import logger from "./utils/logger";

// Download logs as JSON
const logsJson = logger.exportLogs();
const element = document.createElement("a");
element.setAttribute(
  "href",
  "data:text/json;charset=utf-8," + encodeURIComponent(logsJson),
);
element.setAttribute("download", "logs.json");
element.click();
```

### View Backend Logs

```bash
# Recent logs
curl http://localhost:5000/logs?limit=100

# Get stats
curl http://localhost:5000/stats
```

## Best Practices

1. **Always Log Important Actions**
   - Page navigation
   - Filter changes
   - API calls
   - Errors

2. **Include Contextual Data**

   ```javascript
   logAction("info", "Notification viewed", {
     notificationId: id,
     type: notification.Type,
     timestamp: new Date().toISOString(),
   });
   ```

3. **Use Appropriate Log Levels**
   - Use `error` for actual errors
   - Use `warn` for potential issues
   - Use `info` for important actions
   - Use `debug` for development only

4. **Keep Logs Concise**
   - Use clear, descriptive messages
   - Avoid logging sensitive information
   - Include just enough context

5. **Monitor Performance**
   ```javascript
   logPerformance("apiCall", duration);
   logPerformance("priorityCalculation", duration);
   ```

## Privacy Considerations

- Never log sensitive user data (passwords, tokens)
- Avoid logging full request bodies
- Be cautious with personal information
- Consider user privacy regulations

## Troubleshooting

### Logs Not Appearing

1. Check that logging middleware is initialized
2. Verify log level is set correctly
3. Check browser console for errors
4. Ensure backend is running (for backend logs)

### Performance Issues

- Logs are limited to 1000 entries
- Old logs are automatically removed
- Consider clearing old logs periodically

### Missing Data

- Verify data is passed to log function
- Check data format matches expected structure
- Ensure timestamp calculation is correct

## Integration Examples

### Example 1: Track Notification Priority Calculation

```javascript
const startTime = performance.now();
const priority = calculatePriority(notification);
const duration = performance.now() - startTime;

logPerformance("calculatePriority", duration);
logAction("debug", "Priority calculated", {
  notificationId: notification.ID,
  priority: priority,
  duration: duration,
});
```

### Example 2: API Error Handling

```javascript
try {
  const data = await fetchNotifications(limit, page, filterType);
  logApiCall("GET", "/notifications", 200);
} catch (error) {
  logApiCall("GET", "/notifications", error.response?.status, error);
  logAction("error", "Failed to fetch notifications", {
    errorMessage: error.message,
    endpoint: "/notifications",
  });
}
```

### Example 3: User Action Tracking

```javascript
const handleFilterChange = (filterType) => {
  setFilterType(filterType);
  logAction("info", "Filter changed", {
    newFilter: filterType,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
};
```

## Future Enhancements

- Remote logging service integration
- Advanced filtering and search
- Real-time log streaming
- Log aggregation across services
- Alerting for critical logs
- Performance analytics dashboard
- Log rotation and archiving

## License

Affordmed Medical Technologies Private Limited
