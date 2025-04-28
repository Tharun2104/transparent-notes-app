const { ipcRenderer } = require('electron');
const textarea = document.getElementById('noteArea');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const fileMenuBtn = document.getElementById('fileMenuBtn');
const fileDropdown = document.getElementById('fileDropdown');

const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');

// Save button click
saveBtn.addEventListener('click', async () => {
  const success = await ipcRenderer.invoke('save-as', textarea.value);
  if (success) {
    console.log('Saved successfully!');
  }
});

// Load button click
loadBtn.addEventListener('click', async () => {
  const content = await ipcRenderer.invoke('open-file');
  if (content) {
    textarea.value = content;
  }
});

const transparencyRange = document.getElementById('transparencyRange');

// Change Transparency live when user moves the slider
transparencyRange.addEventListener('input', () => {
  const value = transparencyRange.value;
  document.body.style.backgroundColor = `rgba(18, 18, 18, ${value})`;
  textarea.style.backgroundColor = `rgba(80, 80, 80, ${value})`;
});

const floatBtn = document.getElementById('floatBtn');
let isFloating = false;

// Float on Top button click
floatBtn.addEventListener('click', () => {
  isFloating = !isFloating; // toggle true/false
  ipcRenderer.send('toggle-float', isFloating);

  if (isFloating) {
    floatBtn.textContent = 'Unfloat'; // Change text when active
  } else {
    floatBtn.textContent = 'Float on Top'; // Reset text
  }
});




// Toggle dropdown
fileMenuBtn.addEventListener('click', () => {
  if (fileDropdown.style.display === 'flex') {
    fileDropdown.style.display = 'none';
  } else {
    fileDropdown.style.display = 'flex';
  }
});

// Window Controls (✅ Corrected)
closeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-close');
});

minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});

maximizeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-maximize');
});

