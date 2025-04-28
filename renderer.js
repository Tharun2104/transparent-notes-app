const { ipcRenderer } = require('electron');
const marked = require('marked');


// ------------------------
// DOM Elements
// ------------------------
const textarea = document.getElementById('noteArea');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const fileMenuBtn = document.getElementById('fileMenuBtn');
const fileDropdown = document.getElementById('fileDropdown');
const transparencyRange = document.getElementById('transparencyRange');
const floatBtn = document.getElementById('floatBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');

// ------------------------
// Global Variables
// ------------------------
let isFloating = false;
let isDarkTheme = true; // Start with dark mode
let transparencyValue = 0.5; // Default transparency (50%)
let isMarkdownMode = false; // Track whether user is writing markdown or not

// ------------------------
// Save Notes to Local File
// ------------------------
saveBtn.addEventListener('click', async () => {
  const success = await ipcRenderer.invoke('save-as', textarea.value);
  if (success) {
    console.log('Notes saved successfully!');
  }
});

// ------------------------
// Load Notes from Local File
// ------------------------
loadBtn.addEventListener('click', async () => {
  const content = await ipcRenderer.invoke('open-file');
  if (content) {
    textarea.value = content;
  }
});

// ------------------------
// Adjust Transparency
// ------------------------
transparencyRange.addEventListener('input', () => {
  transparencyValue = transparencyRange.value;
  updateBackground(); // Refresh background when slider moves
});

// ------------------------
// Toggle Float on Top
// ------------------------
floatBtn.addEventListener('click', () => {
  isFloating = !isFloating;
  ipcRenderer.send('toggle-float', isFloating);

  floatBtn.textContent = isFloating ? 'Unfloat' : 'Float on Top';
});

// ------------------------
// Markdown code
// ------------------------
const newMarkdownBtn = document.getElementById('newMarkdownBtn');

newMarkdownBtn.addEventListener('click', () => {
  textarea.value = '# New Markdown Note\n\nStart writing your **markdown** here...';
  isMarkdownMode = true;
  
  const previewArea = document.getElementById('previewArea');
  previewArea.style.display = 'block'; // Show when clicking New Markdown
});


textarea.addEventListener('input', () => {
  const previewArea = document.getElementById('previewArea');

  if (isMarkdownMode) {
    previewArea.style.display = 'block';
    previewArea.innerHTML = marked.parse(textarea.value); // ✅ Proper
  } else {
    previewArea.style.display = 'none';
    previewArea.innerHTML = '';
  }
});

// 
// Back To Notes
// 
const backToNotesBtn = document.getElementById('backToNotesBtn');

previewArea.innerHTML = '';

backToNotesBtn.addEventListener('click', () => {
  isMarkdownMode = false;
  
  const previewArea = document.getElementById('previewArea');
  previewArea.style.display = 'none';
  previewArea.innerHTML = '';

  textarea.focus();
});






// ------------------------
// Toggle File Dropdown Menu
// ------------------------
fileMenuBtn.addEventListener('click', () => {
  if (fileDropdown.style.display === 'flex') {
    fileDropdown.style.display = 'none';
  } else {
    fileDropdown.style.display = 'flex';
  }
});

// ------------------------
// Window Control Buttons
// ------------------------
closeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-close');
});

minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});

maximizeBtn.addEventListener('click', () => {
  ipcRenderer.send('window-maximize');
});

// ------------------------
// Toggle Dark / Light Theme
// ------------------------
themeToggleBtn.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
  
    const themeIcon = document.getElementById('themeIcon');
    if (isDarkTheme) {
      themeIcon.src = './assets/icons/moon.svg'; // Moon
      themeIcon.style.filter = 'invert(1)'; // 🛠 Make Moon white
    } else {
      themeIcon.src = './assets/icons/sun.svg'; // Sun
      themeIcon.style.filter = 'invert(0)'; // 🛠 Make Sun black
    }
  
    updateBackground();
  });  

// ------------------------
// Update Backgrounds and Text Colors
// ------------------------
function updateBackground() {
  const bodyBaseColor = isDarkTheme ? '4, 4, 4' : '240, 240, 240';
  const textareaBaseColor = isDarkTheme ? '50, 50, 50' : '255, 255, 255';
  const menuBarColor = isDarkTheme ? 'rgba(11,11,11,0.7)' : 'rgba(230,230,230,0.8)';
  const dropdownColor = isDarkTheme ? 'rgba(30,30,30,0.95)' : 'rgba(250,250,250,0.95)';

  document.body.style.backgroundColor = `rgba(${bodyBaseColor}, ${transparencyValue})`;

  textarea.style.backgroundColor = `rgba(${textareaBaseColor}, ${transparencyValue})`;
  textarea.style.color = isDarkTheme ? '#d3d3d3' : '#333333';

  const previewArea = document.getElementById('previewArea');
  if (previewArea) {
    previewArea.style.backgroundColor = `rgba(${textareaBaseColor}, ${transparencyValue})`;
    previewArea.style.color = isDarkTheme ? '#d3d3d3' : '#333333';
  }

  const menuBar = document.querySelector('.menu-bar');
  if (menuBar) {
    menuBar.style.backgroundColor = menuBarColor;
  }

  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    dropdown.style.backgroundColor = dropdownColor;
  }

  updateMenuColors();
}

  

// ------------------------
// Update Menu Button and Dropdown Text Colors
// ------------------------
function updateMenuColors() {
  const color = isDarkTheme ? 'white' : 'black';

  // File menu button color
  const fileBtn = document.getElementById('fileMenuBtn');
  if (fileBtn) {
    fileBtn.style.color = color;
  }

  // All dropdown buttons color
  const dropdownButtons = document.querySelectorAll('.dropdown button');
  dropdownButtons.forEach(btn => {
    btn.style.color = color;
  });
}

// On initial load, make sure Moon icon is white
document.getElementById('themeIcon').style.filter = 'invert(1)';

