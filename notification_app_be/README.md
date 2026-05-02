# Campus Notification System - Backend

A Node.js/Express backend server that provides logging middleware and helper endpoints for the Campus Notification System.

## Features

- **Logging Middleware**: Comprehensive logging of all requests and events
- **Priority Calculator**: Calculate notification priority scores
- **Statistics Endpoint**: Get request and usage statistics
- **Health Check**: Monitor server health and uptime
- **CORS Support**: Handle cross-origin requests from frontend
- **Error Handling**: Robust error handling and validation

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment (optional):

```bash
# .env file is already created with defaults
# Modify PORT if needed (default: 5000)
```

3. Start the server:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## Available Endpoints

### Health Check

```http
GET /health
```

Returns server status and uptime.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

### Get Logs

```http
GET /logs?limit=100&level=error
```

Retrieve application logs.

**Query Parameters:**

- `limit` (optional): Maximum number of logs to return (default: 100)
- `level` (optional): Filter logs by level (info, error, warn, debug)

**Response:**

```json
{
  "count": 10,
  "logs": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "method": "GET",
      "url": "/api/notifications",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

### Clear Logs

```http
POST /logs/clear
```

Clear all stored logs.

**Response:**

```json
{
  "message": "Logs cleared successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Log Custom Action

```http
POST /logs/action
Content-Type: application/json

{
  "level": "info",
  "message": "User viewed notification",
  "data": {
    "userId": "user123",
    "notificationId": "notif456"
  }
}
```

**Response:**

```json
{
  "success": true,
  "logEntry": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "level": "info",
    "message": "User viewed notification",
    "data": {...},
    "source": "custom"
  }
}
```

### Get Statistics

```http
GET /stats
```

Get request statistics.

**Response:**

```json
{
  "totalLogs": 150,
  "requestMethods": {
    "GET": 120,
    "POST": 30
  },
  "requestUrls": {
    "/health": 50,
    "/logs": 20
  }
}
```

### Calculate Priority

```http
POST /calculate-priority
Content-Type: application/json

{
  "notification": {
    "ID": "notif123",
    "Type": "Placement",
    "Message": "Job Opportunity",
    "Timestamp": "2024-01-01T12:00:00.000Z",
    "isRead": false
  }
}
```

**Response:**

```json
{
  "notificationId": "notif123",
  "typeWeight": 0.9,
  "recencyScore": 0.95,
  "basePriority": 0.872,
  "unreadBoost": 1.2,
  "finalPriority": 1.0464
}
```

## Logging Middleware

The logging middleware automatically logs all incoming requests with:

- Request method and URL
- Client IP address
- User agent
- Request body
- Timestamp

All logs are stored in memory (limited to 1000 entries for performance).

## Priority Calculation Algorithm

The backend implements the same priority algorithm as the frontend:

```
finalPriority = (typeWeight × 0.6 + recencyScore × 0.4) × unreadBoost
```

### Type Weights:

- Placement: 0.9
- Result: 0.7
- Event: 0.5

### Recency Score:

- Formula: `exp(-(hoursSince / 24))`
- Ensures recent notifications have higher priority

### Unread Boost:

- Unread notifications: 1.2x multiplier
- Read notifications: 1.0x multiplier

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Successful request
- `400`: Bad request (missing required fields)
- `404`: Endpoint not found
- `500`: Internal server error

Error responses include:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Project Structure

```
notification_app_be/
├── index.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Port number (default: 5000)
PORT=5000

# Node environment (development/production)
NODE_ENV=development
```

## Dependencies

- **express**: Web framework
- **cors**: Handle CORS requests
- **morgan**: HTTP request logger
- **dotenv**: Environment variable management
- **axios**: HTTP client (for future API integrations)

## Development

### Running Tests

```bash
npm test
```

### Starting in Development Mode

```bash
npm run dev
```

Uses nodemon for auto-reloading on file changes.

## Integration with Frontend

The frontend communicates with the backend to:

1. Log user actions via `/logs/action` endpoint
2. Calculate priorities via `/calculate-priority` endpoint
3. Retrieve statistics via `/stats` endpoint

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Install only production dependencies:

```bash
npm install --production
```

3. Run:

```bash
npm start
```

## Performance Considerations

- Logs are stored in memory with a 1000-entry limit
- Middleware runs efficiently for every request
- No database overhead
- Fast JSON responses

## Monitoring

To monitor the application:

```bash
# Check health
curl http://localhost:5000/health

# Get stats
curl http://localhost:5000/stats

# Get recent logs
curl http://localhost:5000/logs?limit=50
```

## Future Enhancements

- Database integration for persistent logging
- Authentication and authorization
- Rate limiting
- Advanced filtering and search
- Real-time WebSocket support
- Performance analytics
- Alert system for critical events
- Log export/download functionality

## License

Affordmed Medical Technologies Private Limited

## Support

For issues or questions, please contact the development team.
