# Notification System Design

## Executive Summary

This document outlines the priority-based notification system designed to address the challenge of high-volume notification management in the Campus Notification Platform. The system intelligently prioritizes notifications based on type importance and recency to help users focus on the most critical updates.

---

## Problem Statement

The campus notification platform suffers from notification overflow, causing users to lose track of important notifications. Users need a mechanism to identify and view the most important notifications first, rather than relying on chronological ordering.

---

## Solution Architecture

### 1. Priority Scoring Algorithm

The system uses a **weighted hybrid scoring approach** that combines notification type importance with recency factors.

#### Priority Score Formula:

```
priorityScore = (typeWeight × 0.6) + (recencyScore × 0.4)
```

#### Type Weights (Classification by Importance):

- **Placement** (0.9): Highest priority - Critical career-related updates
- **Result** (0.7): Medium-high priority - Examination and assessment results
- **Event** (0.5): Medium priority - Campus events and announcements

#### Recency Score Calculation:

The recency score uses time-decay to prioritize recent notifications while maintaining importance of older critical items:

```
recencyScore = exp(-(hoursSinceNotification / 24))
```

This formula:

- Gives maximum score (1.0) to notifications received in the current hour
- Gradually reduces score over time (50% score at ~16.6 hours)
- Prevents old notifications from being completely hidden

#### Unread Status Boost:

Unread notifications receive a priority boost:

```
finalPriority = priorityScore × (isUnread ? 1.2 : 1.0)
```

---

## Data Structure

### Notification Object:

```json
{
  "id": "string (UUID)",
  "type": "Placement | Result | Event",
  "message": "string",
  "timestamp": "ISO 8601 datetime",
  "isRead": "boolean",
  "priority": "number (calculated)"
}
```

### Calculation Process:

1. Fetch notifications from API
2. Calculate type weight based on notification type
3. Calculate recency score based on timestamp
4. Apply unread boost
5. Sort by priority score (descending)
6. Return top 'n' notifications

---

## Implementation Details

### Algorithm Steps:

**Step 1: Type Weight Assignment**

```
typeWeights = {
  "Placement": 0.9,
  "Result": 0.7,
  "Event": 0.5
}
```

**Step 2: Calculate Hours Since Notification**

```
hoursSince = (currentTime - notificationTimestamp) / 3600000
```

**Step 3: Calculate Recency Score**

```
recencyScore = e^(-(hoursSince / 24))
```

**Step 4: Calculate Base Priority**

```
basePriority = (typeWeight × 0.6) + (recencyScore × 0.4)
```

**Step 5: Apply Unread Boost**

```
finalPriority = basePriority × (isUnread ? 1.2 : 1.0)
```

**Step 6: Sort and Filter**

- Sort all notifications by finalPriority (descending)
- Take top 'n' notifications
- Return paginated results based on limit and page parameters

---

## API Integration

### Notification API Endpoint:

```
GET /evaluation-service/notifications
```

### Query Parameters:

- `limit`: Number of notifications per page (default: 10)
- `page`: Page number for pagination (default: 1)
- `notification_type`: Filter by type (Event, Result, Placement)

### Response Processing:

1. Fetch raw notifications from API
2. Calculate priority scores for each
3. Apply filtering (if notification_type provided)
4. Sort by priority
5. Apply pagination
6. Return prioritized results

---

## Filtering Strategy

### By Notification Type:

Implement client-side filtering after fetching:

```
if (filterType) {
  notifications = notifications.filter(n => n.type === filterType)
}
```

### Priority-Aware Pagination:

1. Calculate priorities for all notifications
2. Sort by priority
3. Apply pagination on sorted results
4. Ensures top 'n' important notifications appear first

---

## Examples

### Example Scoring:

| Notification            | Type      | Age (hrs) | IsUnread | Type Weight | Recency | Base Priority | Unread Boost | Final Priority |
| ----------------------- | --------- | --------- | -------- | ----------- | ------- | ------------- | ------------ | -------------- |
| Placement - ACME Hiring | Placement | 2         | true     | 0.9         | 0.92    | 0.87          | 1.2          | **1.05**       |
| Event - Campus Fest     | Event     | 0.5       | true     | 0.5         | 0.98    | 0.74          | 1.2          | **0.89**       |
| Result - Exam Scores    | Result    | 24        | false    | 0.7         | 0.37    | 0.57          | 1.0          | **0.57**       |
| Event - Seminar         | Event     | 48        | false    | 0.5         | 0.14    | 0.38          | 1.0          | **0.38**       |

Based on this example, display order: 1 → 2 → 3 → 4

---

## Benefits

1. **User-Centric**: Prioritizes critical notifications (Placements/Results)
2. **Intelligent**: Considers both importance and recency
3. **Scalable**: Works efficiently with large notification volumes
4. **Flexible**: Easy to adjust type weights based on institutional priorities
5. **Fair**: Recent old notifications don't disappear; they reduce gradually
6. **Unread First**: Ensures new information is always prominent

---

## Future Enhancements

1. **Machine Learning**: Learn user engagement patterns to adjust weights
2. **User Preferences**: Allow users to customize type weights
3. **Smart Grouping**: Group similar notifications
4. **Notification Digest**: Summarize multiple similar notifications
5. **Mute Categories**: Allow users to hide specific notification types
6. **Scheduled Delivery**: Smart timing of notification delivery

---

## Maintenance & Monitoring

- **Type Weight Tuning**: Review and adjust weights quarterly based on user feedback
- **Performance**: Monitor calculation time for large notification sets
- **Edge Cases**: Handle notifications with missing/invalid timestamps
- **Testing**: Regular A/B testing with different weight configurations

---

## Conclusion

This priority-based notification system provides an intelligent solution to notification overflow by combining type importance with recency factors. The hybrid approach ensures critical notifications remain visible while allowing users to gradually discover older but less critical updates.
