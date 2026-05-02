# Campus Notifications Frontend - Pre-Test Setup Guide

## ⚠️ IMPORTANT: Pre-Test Requirements for Frontend Track

This document outlines the critical steps you must complete BEFORE submitting your project.

---

## 1. Repository Structure Requirements

### Current Issue: ❌

Your project includes a backend folder, but you applied for **FRONTEND TRACK ONLY**.

### Required Structure: ✅

Your repository should ONLY contain:

```
RA2311003010107/  (Your Roll Number)
├── logging_middleware/
│   └── README.md
├── notification_system_design.md
├── notification_app_fe/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

### ❌ DELETE:

- `notification_app_be/` folder (Backend is NOT for frontend track)

---

## 2. Logging Middleware Implementation

### Required Signature:

```javascript
Log(stack, level, package, message);
```

### Parameters:

**stack**: (string)

- `"frontend"` - for your frontend application

**level**: (string) - One of:

- `"debug"`
- `"info"`
- `"warn"`
- `"error"`
- `"fatal"`

**package**: (string) - One of (for Frontend):

- `"api"` - for API calls
- `"component"` - for component actions
- `"hook"` - for custom hooks
- `"page"` - for page-level actions
- `"state"` - for state changes
- `"style"` - for styling issues
- `"auth"` - for authentication
- `"config"` - for configuration
- `"middleware"` - for middleware
- `"utils"` - for utility functions

**message**: (string) - Descriptive message

### Implementation Status: ✅ DONE

The logger has been updated with the correct signature in `src/utils/logger.js`

### Usage Examples:

```javascript
// API call
Log("frontend", "info", "api", "Fetching notifications from API");

// Component action
Log("frontend", "info", "component", "User clicked refresh button");

// State change
Log("frontend", "info", "state", "Filter changed to Placement");

// Error handling
Log("frontend", "error", "api", "Failed to fetch notifications");

// Hook lifecycle
Log("frontend", "debug", "hook", "useEffect cleanup executed");
```

---

## 3. Register on Test Server

### CRITICAL: You MUST Register to Get Credentials

**Registration API:**

```http
POST http://20.207.122.201/evaluation-service/register
```

**Request Body:**

```json
{
  "email": "your-university-email@abc.edu",
  "name": "Your Name",
  "mobileNo": "9999999999",
  "githubUsername": "your-github-username",
  "rollNo": "RA2311003010107",
  "accessCode": "xgAsNC" // Provided in email
}
```

**Response (Save These!):**

```json
{
  "email": "your-email@abc.edu",
  "name": "Your Name",
  "rollNo": "RA2311003010107",
  "accessCode": "xgAsNC",
  "clientID": "d9cbb699-6a27-44a5-8d59-8b1befa816da", // ⭐ SAVE THIS
  "clientSecret": "tVJaaaRBSeXcRXeM" // ⭐ SAVE THIS
}
```

### Get Authorization Token

**Authorization API:**

```http
POST http://20.207.122.201/evaluation-service/auth
```

**Request Body:**

```json
{
  "email": "your-email@abc.edu",
  "name": "Your Name",
  "rollNo": "RA2311003010107",
  "accessCode": "xgAsNC",
  "clientID": "d9cbb699-6a27-44a5-8d59-8b1befa816da",
  "clientSecret": "tVJaaaRBSeXcRXeM"
}
```

**Response:**

```json
{
  "token_type": "Bearer",
  "access_token": "eyJhb...", // Use this in Authorization header
  "expires_in": 1735574344
}
```

---

## 4. Initialize Logger with Credentials

In your `App.js`, initialize the logger with your credentials:

```javascript
import { Log, initializeLogger } from "./utils/logger";

function App() {
  useEffect(() => {
    // Initialize logger ONCE with your credentials
    initializeLogger("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

    // Then start logging
    Log("frontend", "info", "page", "Application initialized");
  }, []);

  // ... rest of your code
}
```

---

## 5. Logging Configuration

### Update App.js

The App.js has been updated with proper logging calls:

- ✅ `Log('frontend', 'info', 'api', ...)` for API calls
- ✅ `Log('frontend', 'info', 'state', ...)` for state changes
- ✅ `Log('frontend', 'info', 'component', ...)` for component actions
- ✅ `Log('frontend', 'error', 'api', ...)` for errors

### NotificationList Component

Updated to use proper logging:

- ✅ Component actions logged with correct package names
- ✅ Error handling with proper log levels

---

## 6. Important Constraints

### ❌ Name/Company Mentions

- **NO** mention of "Affordmed" in:
  - Repository name ✅ (Using Roll Number)
  - README file ✅ (Updated)
  - Commit messages ✅ (Use only your name)

### ✅ Code Quality Standards

- Production-grade code ✅
- Proper error handling ✅
- Comprehensive logging throughout ✅
- Material UI styling (not ShadcN) ✅
- React (JavaScript/TypeScript) ✅

### ✅ UI Requirements

- Responsive design ✅ (Mobile, Tablet, Desktop)
- Material UI components ✅
- Vanilla CSS or Material UI only (NOT ShadcN) ✅
- Professional appearance ✅

### 📸 Screenshots Required

- **Mobile view** - Take screenshot of app on mobile device/emulator
- **Desktop view** - Take screenshot of app on desktop browser
- Save as: `screenshots/mobile.png` and `screenshots/desktop.png`

---

## 7. Pre-Submission Checklist

Before pushing to GitHub:

```
Repository Structure:
☐ Backend folder removed (notification_app_be/)
☐ Only has: logging_middleware, notification_system_design.md, notification_app_fe, .gitignore, README.md
☐ Repository name is your Roll Number (e.g., RA2311003010107)

Code Quality:
☐ All logAction() calls replaced with Log() function
☐ Proper log levels: debug, info, warn, error, fatal
☐ Proper packages: api, component, hook, page, state, style, auth, config, middleware, utils
☐ All imports updated to use new logger

Logging:
☐ Logger initialized with clientID and clientSecret
☐ Logging calls throughout the application
☐ API calls logged with proper package "api"
☐ State changes logged with package "state"
☐ Component interactions logged with package "component"

Registration:
☐ Registered on Test Server
☐ Saved clientID and clientSecret
☐ Got authorization token
☐ Updated App.js with credentials

Documentation:
☐ README.md updated (no Affordmed mentions)
☐ PRE-TEST-SETUP.md created and included
☐ Comments in code explaining logging setup
☐ Screenshots taken (mobile & desktop)

Git:
☐ Regular commits with descriptive messages
☐ NO mention of Affordmed in commits
☐ Branch names follow convention
☐ Code is clean and formatted
```

---

## 8. API Endpoints for Logging

### Log API Endpoint

```http
POST http://20.207.122.201/evaluation-service/logs
```

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "stack": "frontend",
  "level": "info",
  "package": "api",
  "message": "Fetching notifications from API",
  "clientID": "d9cbb699-6a27-44a5-8d59-8b1befa816da"
}
```

**Response:**

```json
{
  "logID": "a4aad02e-19d0-4153-86d9-58bf55d7c402",
  "message": "log created successfully"
}
```

---

## 9. Frontend Track Specific Requirements

### Technology Stack:

- ✅ React (18.2.0)
- ✅ Material UI (MUI) for styling
- ✅ JavaScript/TypeScript (TypeScript preferred)

### NOT Allowed:

- ❌ Backend framework (backend folder)
- ❌ ShadcN or other CSS libraries (Only Material UI or Vanilla CSS)
- ❌ Third-party UI component libraries (except Material UI)
- ❌ Copy-paste code from other applications

### Features:

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ API integration
- ✅ Error handling
- ✅ Comprehensive logging
- ✅ Professional UI with Material Design

---

## 10. Common Issues to Avoid

### ❌ Issue 1: Affordmed Mentions

**Problem**: Repository or README contains "Affordmed"
**Solution**: Remove all references, use only your Roll Number

### ❌ Issue 2: Wrong Logging Signature

**Problem**: Using old `logAction()` instead of `Log()`
**Solution**: All updated in this version ✅

### ❌ Issue 3: Invalid Package Names

**Problem**: Using package names like "notification" or "api-call"
**Solution**: Use only allowed frontend packages

### ❌ Issue 4: No Credentials

**Problem**: Logger not initialized with clientID/clientSecret
**Solution**: Must register and update App.js

### ❌ Issue 5: Backend Code Included

**Problem**: Submitting with backend folder
**Solution**: Delete notification_app_be/ folder

---

## 11. Final Steps

### Step 1: Update Logger Credentials

Open `src/App.js` and update:

```javascript
initializeLogger("YOUR_CLIENT_ID_HERE", "YOUR_CLIENT_SECRET_HERE");
```

### Step 2: Remove Backend Folder

```bash
git rm -r notification_app_be
git commit -m "Remove backend folder - Frontend track only"
```

### Step 3: Verify Repository Structure

```
Your repository should have:
✅ logging_middleware/
✅ notification_system_design.md
✅ notification_app_fe/
✅ .gitignore
✅ README.md
❌ notification_app_be/ (DELETE THIS)
```

### Step 4: Take Screenshots

- Mobile view: Use browser DevTools or mobile emulator
- Desktop view: Full browser window
- Save to: `screenshots/mobile.png` and `screenshots/desktop.png`

### Step 5: Final Commit and Push

```bash
git add .
git commit -m "Complete pre-test setup - ready for submission"
git push origin main
```

---

## 12. Submission Checklist

**Before submitting on Google Form:**

- [ ] Registration completed - credentials saved
- [ ] Logger initialized with credentials
- [ ] All logging calls using correct Log() signature
- [ ] Valid package names (api, component, hook, page, state, style, etc.)
- [ ] No Affordmed mentions anywhere
- [ ] Backend folder deleted
- [ ] Repository structure correct
- [ ] Screenshots taken (mobile & desktop)
- [ ] Code committed and pushed to GitHub
- [ ] No plagiarism - original code only
- [ ] Production-grade code quality
- [ ] Error handling implemented
- [ ] Responsive design verified
- [ ] README updated

---

## 13. Support & Troubleshooting

### Issue: "Log API fails with 401"

- Verify Authorization token is correct
- Check clientID and clientSecret are set
- Regenerate token if expired

### Issue: "Invalid package name"

- Use only allowed frontend packages
- Check spelling (lowercase only)
- Valid options: api, component, hook, page, state, style, auth, config, middleware, utils

### Issue: "Logger not initialized"

- Call initializeLogger() in useEffect
- Pass correct clientID and clientSecret
- Check credentials were saved from registration

### Issue: "GitHub username mismatch"

- Ensure GitHub username in registration matches actual GitHub username
- Check for typos
- Re-register if needed

---

## Quick Reference

### Log Function Signature

```javascript
Log(stack, level, package, message);
Log("frontend", "info", "api", "Loading notifications");
```

### Valid Values

- **stack**: "frontend"
- **level**: "debug" | "info" | "warn" | "error" | "fatal"
- **package**: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils"

### Key Files Updated

- ✅ `src/utils/logger.js` - New Log function
- ✅ `src/App.js` - All logging calls updated
- ✅ `src/components/NotificationList.js` - Component logging
- ✅ `src/utils/notificationUtils.js` - Already clean
- ✅ `README.md` - Updated (see below)

---

## Next Steps

1. **Complete Registration**: Register on Test Server, get credentials
2. **Update Credentials**: Add clientID & clientSecret to App.js
3. **Delete Backend**: Remove notification_app_be folder
4. **Verify Logging**: Test all Log() calls in browser console
5. **Take Screenshots**: Capture mobile and desktop views
6. **Final Push**: Commit and push to GitHub
7. **Submit**: Use Google Form with Repository Link

---

**Status**: ✅ Project Ready for Pre-Test Setup
**Date**: May 2, 2026
**Track**: Frontend Only
**Framework**: React + Material UI
