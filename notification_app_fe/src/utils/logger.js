/**
 * Logging utility - Pre-Test Setup Specification
 * Implements Log(stack, level, package, message) function
 * Sends logs to: http://20.207.122.201/evaluation-service/logs
 */

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

// Valid log levels
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];

// Valid packages for frontend
const VALID_PACKAGES = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
];

// Configuration (needs to be set during initialization)
let logConfig = {
  clientID: null,
  clientSecret: null,
  stack: "frontend",
};

/**
 * Initialize logger with credentials
 * Must be called with clientID and clientSecret from registration
 */
export const initializeLogger = (clientID, clientSecret) => {
  logConfig.clientID = clientID;
  logConfig.clientSecret = clientSecret;
  console.log("Logger initialized with credentials");
};

/**
 * Main Log function - Signature: Log(stack, level, package, message)
 * Calls the Log API to send logs to Test Server
 */
export const Log = async (stack, level, packageName, message) => {
  // Validate inputs
  if (!stack || !level || !packageName || !message) {
    console.error("Log: Missing required parameters");
    return null;
  }

  if (!VALID_LEVELS.includes(level)) {
    console.error(
      `Log: Invalid level '${level}'. Must be one of: ${VALID_LEVELS.join(", ")}`,
    );
    return null;
  }

  if (!VALID_PACKAGES.includes(packageName)) {
    console.error(
      `Log: Invalid package '${packageName}'. Must be one of: ${VALID_PACKAGES.join(", ")}`,
    );
    return null;
  }

  const logEntry = {
    stack: stack,
    level: level,
    package: packageName,
    message: message,
    timestamp: new Date().toISOString(),
  };

  // Log to console
  _logToConsole(level, packageName, message);

  // Send to Log API if credentials are available
  if (logConfig.clientID && logConfig.clientSecret) {
    try {
      await _sendToLogAPI(logEntry);
    } catch (error) {
      console.error("Failed to send log to API:", error);
    }
  } else {
    console.warn("Logger: credentials not set. Call initializeLogger() first");
  }

  return logEntry;
};

/**
 * Send log to the Test Server API
 */
const _sendToLogAPI = async (logEntry) => {
  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logConfig.clientSecret}`,
      },
      body: JSON.stringify({
        ...logEntry,
        clientID: logConfig.clientID,
      }),
    });

    if (!response.ok) {
      console.error(`Log API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error calling Log API:", error);
  }
};

/**
 * Log to browser console with styling
 */
const _logToConsole = (level, packageName, message) => {
  const styles = {
    debug: "color: #666666; font-weight: bold;",
    info: "color: #0066cc; font-weight: bold;",
    warn: "color: #ff9900; font-weight: bold;",
    error: "color: #cc0000; font-weight: bold;",
    fatal: "color: #990000; font-weight: bold;",
  };

  const style = styles[level] || styles.info;
  const timestamp = new Date().toISOString().split("T")[1].split("Z")[0];

  console.log(
    `%c[${level.toUpperCase()}] ${timestamp} [${packageName}] ${message}`,
    style,
  );
};

/**
 * Convenience wrapper for component logs
 */
export const logComponent = (componentName, action, details = "") => {
  return Log(
    "frontend",
    "info",
    "component",
    `${componentName}: ${action}${details ? " - " + details : ""}`,
  );
};

/**
 * Convenience wrapper for API logs
 */
export const logApi = (method, endpoint, status, errorMsg = null) => {
  const message = `${method} ${endpoint} [${status}]${errorMsg ? " - " + errorMsg : ""}`;
  return Log("frontend", status >= 400 ? "error" : "info", "api", message);
};

/**
 * Convenience wrapper for hook logs
 */
export const logHook = (hookName, action) => {
  return Log("frontend", "debug", "hook", `${hookName}: ${action}`);
};

/**
 * Convenience wrapper for state logs
 */
export const logState = (stateName, action, value) => {
  return Log(
    "frontend",
    "debug",
    "state",
    `${stateName}: ${action} = ${value}`,
  );
};

/**
 * Convenience wrapper for utility logs
 */
export const logUtil = (utilName, action) => {
  return Log("frontend", "debug", "utils", `${utilName}: ${action}`);
};

export default {
  Log,
  initializeLogger,
  logComponent,
  logApi,
  logHook,
  logState,
  logUtil,
};
