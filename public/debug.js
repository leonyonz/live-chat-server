/**
 * Debug Utility for Live Chat Client
 * Provides controlled console logging that can be enabled/disabled
 */

// Get debug setting from URL parameter or default to true
// This allows overriding the debug setting without changing the .env file
const urlParams = new URLSearchParams(window.location.search);
const debugParam = urlParams.get('debug');

// Default to true if not specified in URL, otherwise use URL parameter
const DEBUG_ENABLED = debugParam !== null ? debugParam === 'true' : true;

/**
 * Debug logger that respects the DEBUG_ENABLED setting
 * @param {...any} args - Arguments to log
 */
function debugLog(...args) {
  if (DEBUG_ENABLED) {
    console.log('[LiveChat Debug]', ...args);
  }
}

/**
 * Debug error logger that respects the DEBUG_ENABLED setting
 * @param {...any} args - Arguments to log
 */
function debugError(...args) {
  if (DEBUG_ENABLED) {
    console.error('[LiveChat Debug]', ...args);
  }
}

/**
 * Debug warn logger that respects the DEBUG_ENABLED setting
 * @param {...any} args - Arguments to log
 */
function debugWarn(...args) {
  if (DEBUG_ENABLED) {
    console.warn('[LiveChat Debug]', ...args);
  }
}

/**
 * Debug info logger that respects the DEBUG_ENABLED setting
 * @param {...any} args - Arguments to log
 */
function debugInfo(...args) {
  if (DEBUG_ENABLED) {
    console.info('[LiveChat Debug]', ...args);
  }
}

// Export functions for use in other modules
window.LiveChatDebug = {
  log: debugLog,
  error: debugError,
  warn: debugWarn,
  info: debugInfo,
  isEnabled: DEBUG_ENABLED
};

// Log initialization
debugLog('Debug utilities initialized. Debug mode:', DEBUG_ENABLED);
debugLog('Override debug mode by adding ?debug=true or ?debug=false to URL');
