# Campus Notification System - Frontend

A responsive React-based frontend application for the Campus Notification System that displays prioritized notifications with real-time updates.

## Features

- **Priority-Based Display**: Notifications are displayed in order of importance based on type and recency
- **Type Filtering**: Filter notifications by type (Placement, Result, Event)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Fetch latest notifications with refresh functionality
- **Pagination**: Navigate through notifications with customizable page size
- **Priority Visualization**: Visual priority indicators and ranking badges
- **Logging Integration**: Comprehensive logging of all user actions
- **Material UI**: Professional and modern UI components

## Priority Algorithm

The notification priority is calculated using a hybrid scoring approach:

```
Priority Score = (typeWeight × 0.6) + (recencyScore × 0.4) × (isUnread ? 1.2 : 1.0)
```

### Type Weights:

- **Placement**: 0.9 (Highest - Career-related)
- **Result**: 0.7 (Medium-high - Exam results)
- **Event**: 0.5 (Medium - Campus events)

### Recency Score:

- Uses exponential decay: `exp(-(hoursSince / 24))`
- Ensures recent notifications have higher priority
- Older critical items still remain visible

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will run on `http://localhost:3000`

## Available Scripts

- `npm start`: Run development server
- `npm build`: Create production build
- `npm test`: Run tests
- `npm eject`: Eject from Create React App (irreversible)

## API Integration

### Notification API Endpoint

```
GET http://20.207.122.201/evaluation-service/notifications
```

### Query Parameters

- `limit`: Number of notifications per page (default: 10)
- `page`: Page number for pagination (default: 1)
- `notification_type`: Filter by type (Event, Result, Placement)

### Expected Response Format

```json
{
  "notifications": [
    {
      "ID": "string",
      "Type": "Placement|Result|Event",
      "Message": "string",
      "Timestamp": "ISO 8601 datetime"
    }
  ]
}
```

## Project Structure

```
notification_app_fe/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── NotificationList.js
│   ├── utils/
│   │   ├── notificationUtils.js
│   │   └── logger.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Components

### App Component

Main application component handling:

- Data fetching from API
- Priority calculation
- Filter and pagination logic
- UI rendering

### NotificationList Component

Displays list of notifications with:

- Priority visualization
- Type-based styling
- Favorite functionality
- Mark as read action
- Ranking badges

## Utilities

### notificationUtils.js

- `fetchNotifications()`: API data fetching
- `calculatePriority()`: Priority score calculation
- `filterAndSortNotifications()`: Filtering and sorting logic
- `formatTimestamp()`: Human-readable timestamps
- `getNotificationIcon()`: Icon selection
- `getNotificationColor()`: Color mapping

### logger.js

- `logAction()`: Log user actions
- `logNotificationEvent()`: Log notification-specific events
- `logApiCall()`: Log API requests
- `logPerformance()`: Log performance metrics
- `getLogger()`: Access logger instance

## Styling

The application uses:

- **Material UI (MUI)**: Core UI components and theming
- **Emotion**: CSS-in-JS styling solution
- **Responsive Design**: Mobile-first approach with breakpoints

## Key Features

### Priority Display

- Notifications are ranked by priority score
- Visual indicators show priority percentage
- Ranking badges (#1, #2, etc.) display position

### Filtering

- Filter by notification type
- All types option to see everything
- Stats chip showing count by type

### Pagination

- Configurable items per page (5, 10, 15, 20)
- Navigate through pages with Pagination component
- Maintains filter when changing pages

### Logging

- All user actions are logged
- Filter changes tracked
- Navigation tracked
- API calls logged
- Errors captured and logged

## Performance Considerations

- Notifications are sorted once after fetching
- Pagination reduces DOM elements
- Memoization used for expensive calculations
- Efficient re-renders with React hooks

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling

- API errors display user-friendly messages
- Network failures are caught and logged
- Invalid data formats are handled gracefully
- Fallback values for missing fields

## Future Enhancements

- Real-time WebSocket updates
- User preference customization
- Notification dismissal
- Advanced search functionality
- Dark mode support
- Notification sound alerts
- Desktop notifications API integration

## Contributing

When contributing to this project:

1. Maintain the existing code style
2. Add logging for new features
3. Test priority calculations
4. Update documentation
5. Test on multiple devices

## License

Affordmed Medical Technologies Private Limited

## Support

For issues or questions, please contact the development team.
