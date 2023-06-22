// Saves options to chrome.storage
const saveOptions = () => {
    const shortcutsEnabled = document.getElementById('ks-enabled').checked;
  
    browser.storage.sync.set(
      {shortcutsEnabled: shortcutsEnabled }).then(
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in browser.storage.
  const restoreOptions = () => {
    browser.storage.sync.get(
      {shortcutsEnabled: true }).then(
      (items) => {
        document.getElementById('ks-enabled').checked = items.shortcutsEnabled;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);