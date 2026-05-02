# Campus Notifications Frontend Application

## ⚠️ PRE-TEST SETUP REQUIRED

**Before submission, complete the steps in [PRE-TEST-SETUP.md](PRE-TEST-SETUP.md)**

Key requirements:

- ✅ Register on Test Server (get clientID & clientSecret)
- ✅ Initialize logger with credentials
- ✅ Implement Log(stack, level, package, message) function
- ✅ Delete backend folder (Frontend track only)
- ✅ Take mobile and desktop screenshots

---

## Project Overview

This is a **Frontend-Only** Campus Notifications application built with **React** and **Material UI**.

**Track**: Frontend Only  
**Framework**: React 18 + Material UI 5  
**Language**: JavaScript  
**Status**: ✅ Ready for Pre-Test Setup

### Features:

- React-based responsive UI (Mobile, Tablet, Desktop)
- Notification display with priority sorting
- Advanced filtering by notification type
- Pagination support
- Comprehensive logging integration (Pre-Test compliant)
- Material Design UI
- Error handling and loading states

## Pre-Test Setup

### 🚨 CRITICAL: Read [PRE-TEST-SETUP.md](PRE-TEST-SETUP.md) First

This document contains:

1. Repository structure requirements (DELETE backend folder!)
2. Logging function signature specification: `Log(stack, level, package, message)`
3. Registration process for Test Server
4. How to initialize logger with credentials
5. Pre-submission checklist
6. Common issues and solutions

## Quick Setup (After Registration)

1. **Get Credentials from Test Server**:
   - Register: `http://20.207.122.201/evaluation-service/register`
   - Save clientID and clientSecret securely

2. **Update Logger Credentials** in `src/App.js`:

   ```javascript
   import { Log, initializeLogger } from "./utils/logger";

   useEffect(() => {
     // Initialize with your credentials from registration
     initializeLogger("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");
     Log("frontend", "info", "page", "App initialized");
   }, []);
   ```

3. **Run the Application**:

   ```bash
   cd notification_app_fe
   npm install
   npm start
   ```

   - App opens at: `http://localhost:3000`

4. **Verify Logging**:
   - Open browser DevTools (F12) → Console tab
   - Should see formatted log messages
   - Check Network tab for API calls

5. **Take Screenshots**:
   - Mobile view (use DevTools device emulator)
   - Desktop view (full browser window)
   - Save as: `screenshots/mobile.png` and `screenshots/desktop.png`

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation & Running

#### Frontend Setup

```bash
cd notification_app_fe
npm install
npm start
```

- Frontend runs on: `http://localhost:3000`
- Features: Notification display, filtering, pagination, priority visualization

#### Verify Setup

- Open `http://localhost:3000` in your browser
- Check browser console for log messages
- Verify notifications are loading
- Test filter and pagination

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React App)                   │
│                   localhost:3000                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Notification Display & Priority Management    │    │
│  │  - Fetch from API                              │    │
│  │  - Calculate priorities                        │    │
│  │  - Filter & sort                               │    │
│  │  - Display with pagination                     │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                  │
│              Logging Middleware (logger.js)              │
│         Logs all actions and API calls                   │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │   Backend Server               │
        │   localhost:5000               │
        │                                │
        │  - Logging Middleware          │
        │  - Priority Calculator         │
        │  - Logs Storage (in-memory)    │
        │  - Statistics                  │
        └────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │  External API                  │
        │  /evaluation-service/          │
        │  notifications                 │
        └────────────────────────────────┘
```

### Data Flow

1. **Notification Fetching**
   - Frontend requests notifications from external API
   - API endpoint: `http://20.207.122.201/evaluation-service/notifications`

2. **Priority Calculation**
   - Frontend calculates priority scores locally
   - Algorithm: `(typeWeight × 0.6) + (recencyScore × 0.4) × unreadBoost`

3. **Logging**
   - All actions logged to console and backend
   - Backend stores in-memory (last 1000 logs)

4. **Display**
   - Sorted by priority
   - Paginated for performance
   - Filtered by type if selected

## Feature Details

### Stage 1: Priority System Design ✅

Complete! See `notification_system_design.md`

Key features:

- Type-based weighting (Placement 0.9, Result 0.7, Event 0.5)
- Time-decay recency scoring
- Unread notification boost
- Detailed algorithm documentation

### Stage 2: Frontend Application ✅

Complete! React app with Material UI

Key features:

- Responsive design (mobile, tablet, desktop)
- Priority visualization with score indicators
- Type filtering (All, Placement, Result, Event)
- Pagination (5, 10, 15, 20 items per page)
- Favorite/Mark as read functionality
- Real-time refresh
- Comprehensive error handling
- Integrated logging

### Logging System ✅

Complete! Integrated throughout

Key features:

- Frontend logger (in-memory + console)
- Backend logging middleware
- Action tracking
- API call logging
- Performance monitoring
- Error capturing

## API Reference

### Frontend to External API

```http
GET http://20.207.122.201/evaluation-service/notifications
?limit=10&page=1&notification_type=Placement
```

Response:

```json
{
  "notifications": [
    {
      "ID": "string",
      "Type": "Placement|Result|Event",
      "Message": "string",
      "Timestamp": "ISO 8601"
    }
  ]
}
```

### Frontend to Backend (Logging)

```http
POST http://localhost:5000/logs/action
Content-Type: application/json

{
  "level": "info",
  "message": "Action description",
  "data": { "context": "value" }
}
```

### Backend Endpoints

| Endpoint              | Method | Purpose                         |
| --------------------- | ------ | ------------------------------- |
| `/health`             | GET    | Server health check             |
| `/logs`               | GET    | Retrieve logs                   |
| `/logs/clear`         | POST   | Clear all logs                  |
| `/logs/action`        | POST   | Log custom action               |
| `/stats`              | GET    | Request statistics              |
| `/calculate-priority` | POST   | Calculate notification priority |

## Key Algorithms

### Priority Calculation

```javascript
// Type Weights
Placement: 0.9 (highest priority)
Result: 0.7 (medium-high)
Event: 0.5 (medium)

// Recency Score (time decay)
recencyScore = e^(-(hoursSince / 24))

// Base Priority
basePriority = (typeWeight × 0.6) + (recencyScore × 0.4)

// Final Priority (with unread boost)
finalPriority = basePriority × (isUnread ? 1.2 : 1.0)
```

### Example Calculation

```
Notification: "ACME Job Posting"
Type: Placement (weight: 0.9)
Age: 2 hours (recency: 0.92)
Unread: Yes

Calculation:
basePriority = (0.9 × 0.6) + (0.92 × 0.4) = 0.54 + 0.368 = 0.908
finalPriority = 0.908 × 1.2 = 1.0896
percentScore = 109% (capped at 100% for display)
```

## File Structure

```
RA2311003010107/
├── notification_system_design.md          [Stage 1 Design Doc]
├── logging_middleware/
│   └── README.md                          [Logging Guide]
├── notification_app_fe/                   [Frontend App]
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── NotificationList.js
│   │   ├── utils/
│   │   │   ├── notificationUtils.js
│   │   │   └── logger.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .gitignore
│   └── README.md
├── notification_app_be/                   [Backend App]
│   ├── index.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
└── README.md                              [This file]
```

## Configuration

### Frontend Environment

No environment variables needed. Frontend is configured in `App.js`:

- API endpoint: `http://20.207.122.201/evaluation-service/notifications`
- Default limit: 10 notifications
- Default page: 1

### Backend Environment

Edit `.env` in `notification_app_be/`:

```env
PORT=5000
NODE_ENV=development
```

## Development Workflow

### Making Changes

1. **Frontend Changes**
   - Edit files in `notification_app_fe/src/`
   - Changes auto-refresh in browser
   - Check console for logging

2. **Backend Changes**
   - Edit `notification_app_be/index.js`
   - Restart server (if not using nodemon)
   - Test endpoints with curl or Postman

3. **Logging Adjustments**
   - Edit `notification_app_fe/src/utils/logger.js`
   - View logs in browser console
   - Or retrieve from backend: `/logs`

### Testing

```bash
# Test Frontend (manual)
npm start  # in notification_app_fe/

# Test Backend endpoints
curl http://localhost:5000/health
curl http://localhost:5000/stats
curl http://localhost:5000/logs?limit=20

# Test Priority Calculation
curl -X POST http://localhost:5000/calculate-priority \
  -H "Content-Type: application/json" \
  -d '{
    "notification": {
      "ID": "test123",
      "Type": "Placement",
      "Timestamp": "2024-01-01T12:00:00Z",
      "isRead": false
    }
  }'
```

## Troubleshooting

### Frontend Not Loading

1. Check if port 3000 is available
2. Check for errors in browser console
3. Verify backend is running (for logging)
4. Clear browser cache and reload

### No Notifications Displaying

1. Verify external API is accessible
2. Check network tab in DevTools
3. Check browser console for errors
4. Verify API response format

### Backend Not Starting

1. Check if port 5000 is available
2. Run `npm install` in `notification_app_be/`
3. Check Node.js version (v14+)
4. Review error messages in console

### Logging Not Working

1. Check browser console for errors
2. Verify backend is running
3. Check `/logs` endpoint: `curl http://localhost:5000/logs`
4. Check frontend logger initialization

## Performance Tips

1. **Limit Notifications**: Start with 10 per page
2. **Clear Logs Periodically**: Use POST `/logs/clear`
3. **Monitor Stats**: Check `/stats` endpoint
4. **Optimize Calculations**: Priority calculation is O(n)

## Deployment

### Frontend Deployment

```bash
cd notification_app_fe
npm run build
# Upload build/ folder to hosting service
```

### Backend Deployment

```bash
cd notification_app_be
npm install --production
# Deploy to server (e.g., Heroku, AWS, etc.)
NODE_ENV=production npm start
```

## Standards & Best Practices

1. **Code Quality**
   - Use meaningful variable names
   - Add comments for complex logic
   - Follow existing code style

2. **Logging**
   - Log important actions
   - Include context in logs
   - Use appropriate log levels

3. **Error Handling**
   - Catch and log errors
   - Provide user-friendly messages
   - Handle edge cases

4. **Performance**
   - Minimize re-renders
   - Use pagination
   - Optimize calculations

## Support & Documentation

- **Design Doc**: See `notification_system_design.md`
- **Frontend Guide**: See `notification_app_fe/README.md`
- **Backend Guide**: See `notification_app_be/README.md`
- **Logging Guide**: See `logging_middleware/README.md`

## Version History

- **v1.0.0** (2024-01-01): Initial release
  - Stage 1: Priority system design
  - Stage 2: Frontend React application
  - Integrated logging system
  - Backend logging middleware

## License

Affordmed Medical Technologies Private Limited

## Contact

For questions or support, contact the development team.

---

**Status**: ✅ Complete and Ready for Testing
**Last Updated**: 2024-01-01
**Next Steps**: Deploy and monitor in production
