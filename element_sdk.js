// Lightweight element SDK placeholder that matches the app's expected API.
// Implements: window.elementSdk.init({ defaultConfig, onConfigChange, ... }) and window.elementSdk.register
console.log('element_sdk.js loaded (placeholder)');
(function () {
  let currentConfig = {};
  let onConfigChange = null;

  window.elementSdk = {
    init: function (opts) {
      opts = opts || {};
      currentConfig = opts.defaultConfig || {};
      onConfigChange = typeof opts.onConfigChange === 'function' ? opts.onConfigChange : null;

      // Immediately notify with default config so UI can update
      if (onConfigChange) {
        try { onConfigChange(currentConfig); } catch (e) { console.error('elementSdk.onConfigChange failed', e); }
      }

      // Return an object to mimic an SDK response if awaited
      return { isOk: true };
    },

    register: function (name, opts) {
      console.log('elementSdk.register', name, opts);
      // No-op placeholder: real SDK might expose UI controls; this just logs.
      return { isOk: true };
    },

    // Utility to programmatically change config from the console for testing
    _setConfigForTesting: function (cfg) {
      currentConfig = Object.assign({}, currentConfig, cfg);
      if (onConfigChange) onConfigChange(currentConfig);
    }
  };
})();
