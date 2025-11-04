// Lightweight in-browser data SDK placeholder that matches the app's expected API.
// Implements: window.dataSdk.init(handler), create(record), delete(record), query()
console.log('data_sdk.js loaded (placeholder)');
(function () {
  const STORAGE_KEY = 'healthApp_backend_records_v1';
  let records = [];
  try {
    records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    records = [];
  }

  let dataHandler = null;

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch (e) { /* ignore */ }
  }

  window.dataSdk = {
    init: async function (handler) {
      dataHandler = handler || null;
      // Notify app of current data
      if (dataHandler && typeof dataHandler.onDataChanged === 'function') {
        try { dataHandler.onDataChanged(records.slice()); } catch (e) { console.error('dataSdk: onDataChanged handler failed', e); }
      }
      return { isOk: true };
    },

    create: async function (item) {
      const newItem = Object.assign({}, item);
      // attach a backend id if not present
      newItem.__backendId = newItem.__backendId || ('b' + Date.now() + Math.floor(Math.random() * 1000));
      records.push(newItem);
      persist();
      if (dataHandler && typeof dataHandler.onDataChanged === 'function') {
        try { dataHandler.onDataChanged(records.slice()); } catch (e) { console.error('dataSdk: onDataChanged failed', e); }
      }
      return { isOk: true, item: newItem };
    },

    delete: async function (item) {
      const id = item.__backendId || item.id;
      const idx = records.findIndex(r => r.__backendId === item.__backendId || r.id === id);
      if (idx === -1) return { isOk: false, error: 'not_found' };
      records.splice(idx, 1);
      persist();
      if (dataHandler && typeof dataHandler.onDataChanged === 'function') {
        try { dataHandler.onDataChanged(records.slice()); } catch (e) { console.error('dataSdk: onDataChanged failed', e); }
      }
      return { isOk: true };
    },

    query: async function () {
      return { isOk: true, data: records.slice() };
    }
  };
})();
