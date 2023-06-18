const defaults = {
  bold: {
    active: true,
    combo: []
  },
  italic: {
    active: true,
    combo: []
  },
  quote: {
    active: true,
    combo: []
  },
  link: {
    active: true,
    combo: []
  }
};

// Saves options to chrome.storage
const saveOptions = () => {
    const color = document.getElementById('color').value;
    const likesColor = document.getElementById('like').checked;
  
    chrome.storage.sync.set(
      { favoriteColor: color, likesColor: likesColor },
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
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { key_combos: defaults },
      (items) => {
        console.log(items);
      }
    );

    chrome.storage.sync.get()
  };

var key_set = new Set();
var recording_type = null;

const record = (e) => {
  console.log(e.target.value);
  if(recording_type == e.target.value){
    setCombo();
  }
  else{
    recording_type = e.target.value;
  }
};

const keyDown = (e) => {
  if(recording_type == null) return;
  console.log(e.key);
    key_set.add(e.key)
  }
const keyUp = (e) => {

}
const focusOut = (e) => {
}

const setCombo = () => {
  console.log(Array.from(key_set).join('+'));
  key_set.clear();
  key_combo = [];
  recording_type = null;

}
  
  const keydiv = document.getElementById('keys');
  const record_btn = document.querySelector('.record');
  record_btn.addEventListener('click', record);
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp)
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);