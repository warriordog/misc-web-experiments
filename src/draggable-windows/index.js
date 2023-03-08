import './HWindowElement.js';

/** @type {HTMLButtonElement | null} */
const newWindowButton = document.querySelector('#newWindowButton');
newWindowButton?.addEventListener('click', () => {
    const win = document.createElement('h-window');
    win.windowTitle = 'New Window';
    win.body.innerHTML = '<p>You just made a new window!<br>Try moving it around and interacting with other windows.</p>';

    document.body.append(win);
    win.activate();
});

/** @type {HTMLSelectElement | null} */
const wmSelect = document.querySelector('#wmSelector');
wmSelect?.addEventListener('change', () => {
   const wm = document.querySelector('#wm');
   wm?.classList.toggle('vertical-wm', wmSelect.value === 'vertical');
   wm?.classList.toggle('none-wm', wmSelect.value === 'none');
});

// Pre-arrange the windows
const windows = document.querySelectorAll('h-window');
for (let i = 0; i < windows.length; i++) {
    const offset = (i + 1) * 50;
    const win = windows[i];

    win.move(offset, offset);
}