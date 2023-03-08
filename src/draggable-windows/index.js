import './HWindowElement.js';

const button = document.querySelector('#newWindowButton')
if (button) {
    button.addEventListener('click', () => {
        const win = document.createElement('h-window');
        win.windowTitle = 'New Window';
        win.body.innerHTML = '<p>You just made a new window!<br>Try moving it around and interacting with other windows.</p>';

        document.body.append(win);
        win.activate();
    });
}

// Pre-arrange the windows
const windows = document.querySelectorAll('h-window');
for (let i = 0; i < windows.length; i++) {
    const offset = (i + 1) * 50;
    const win = windows[i];

    win.move(offset, offset);
}