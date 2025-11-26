/**
 * Analytics Utility
 * Tracks user events, page views, and custom metrics
 */

const ANALYTICS_ENDPOINT =
  process.env.REACT_APP_ANALYTICS_ENDPOINT || "/api/analytics/event";
const ENABLE_ANALYTICS = process.env.REACT_APP_ENABLE_ANALYTICS !== "false";

// Session tracking
let sessionId = null;
let userId = null;

// Get or create session ID
function getSessionId() {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
  }
  return sessionId;
}

// Get user ID from storage or Redux
function getUserId() {
  if (!userId) {
    // Try to get from localStorage or Redux store
    const stored = localStorage.getItem("user_id");
    if (stored) {
      userId = stored;
    }
  }
  return userId;
}

// Send analytics event
function sendEvent(eventData) {
  if (!ENABLE_ANALYTICS) {
    return;
  }

  const payload = {
    ...eventData,
    sessionId: getSessionId(),
    userId: getUserId(),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  // Use sendBeacon for better reliability
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
  } else {
    // Fallback to fetch
    fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((error) => {
      console.warn("Analytics event failed:", error);
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName, additionalData = {}) {
  sendEvent({
    type: "page_view",
    page: pageName,
    ...additionalData,
  });
}

/**
 * Track user action/event
 */
export function trackEvent(category, action, label = null, value = null) {
  sendEvent({
    type: "event",
    category,
    action,
    label,
    value,
  });
}

/**
 * Track user interaction
 */
export function trackInteraction(element, action, details = {}) {
  sendEvent({
    type: "interaction",
    element,
    action,
    ...details,
  });
}

/**
 * Track API call
 */
export function trackAPI(endpoint, method, duration, status, error = null) {
  sendEvent({
    type: "api_call",
    endpoint,
    method,
    duration,
    status,
    error,
  });
}

/**
 * Track error
 */
export function trackError(error, context = {}) {
  sendEvent({
    type: "error",
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  });
}

/**
 * Track business metric
 */
export function trackBusinessMetric(metricName, value, metadata = {}) {
  sendEvent({
    type: "business_metric",
    metric: metricName,
    value,
    ...metadata,
  });
}

/**
 * Track conversion/goal
 */
export function trackConversion(goalName, value = null, metadata = {}) {
  sendEvent({
    type: "conversion",
    goal: goalName,
    value,
    ...metadata,
  });
}

/**
 * Track timing
 */
export function trackTiming(name, duration, category = "custom") {
  sendEvent({
    type: "timing",
    name,
    duration,
    category,
  });
}

/**
 * Initialize analytics
 */
export function initAnalytics() {
  if (!ENABLE_ANALYTICS) {
    return;
  }

  // Track initial page view
  trackPageView(window.location.pathname);

  // Track page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      trackEvent("Page", "Hidden");
    } else {
      trackEvent("Page", "Visible");
    }
  });

  // Track unload
  window.addEventListener("beforeunload", () => {
    trackEvent("Session", "End");
  });
}

// Auto-initialize if in browser
if (typeof window !== "undefined") {
  initAnalytics();
}

export default {
  trackPageView,
  trackEvent,
  trackInteraction,
  trackAPI,
  trackError,
  trackBusinessMetric,
  trackConversion,
  trackTiming,
  initAnalytics,
};
