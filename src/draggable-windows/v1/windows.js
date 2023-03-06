/**
 * @template T
 * @this {T[]}
 * @param {T} value
 * @returns {T[]}
 */
Array.prototype.remove = function(value) {
    const index = this.indexOf(value);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
}

/**
 *
 * @returns {Promise<void>}
 */
Document.prototype.whenReady = function() {
    return new Promise(resolve => {
        if (document.readyState !== 'loading') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => resolve());
        }
    });
}

document
    .whenReady()
    .then(() => {
        /** @type {WindowElement[]} */
        const windows = Array.from(document.querySelectorAll('.window'));

        /**
         * @param {WindowElement} window
         */
        function activateWindow(window) {
            // Skip if window is active
            if (window.active)
                return;

            // Move window to start
            windows.remove(window);
            windows.push(window)

            // Update state
            windows.forEach((w, idx) => {
                w.style.zIndex = String(idx);
                w.active = w === window;
                w.setAttribute('aria-hidden', w.active ? 'false' : 'true');
            });
        }

        /**
         * @param {WindowElement} window
         * @param {MouseEvent} event
         */
        function dragStart(window, event) {
            if (!window.drag) {
                const bounds = window.getBoundingClientRect();
                window.drag = {
                    offsetX: event.clientX - bounds.left,
                    offsetY: event.clientY - bounds.top
                };
                // console.log(`START event(${event.clientY},${event.clientX}) window(${bounds.top},${bounds.left}) offset(${window.drag.offsetY},${window.drag.offsetX})`);
            }

            window.header.style.cursor = 'dragging';
            event.preventDefault();
        }
        /**
         * @param {WindowElement} window
         * @param {MouseEvent} event
         */
        function dragEnd(window, event) {
            dragMove(window, event);

            window.drag = undefined;
            window.header.style.cursor = 'grab';
        }
        /**
         * @param {WindowElement} window
         * @param {MouseEvent} event
         */
        function dragMove(window, event) {
            if (!window.drag)
                return;

            const newTop = event.clientY - window.drag.offsetY;
            const newLeft = event.clientX - window.drag.offsetX;

            // const bounds = window.getBoundingClientRect();
            // console.log(`END event(${event.clientY},${event.clientX}) window(${bounds.top},${bounds.left}) new(${newTop},${newLeft})`);

            window.style.top = `${ newTop }px`;
            window.style.left = `${ newLeft }px`;
        }

        // Bind events
        windows.forEach(w => {
            w.addEventListener('focusin', () => activateWindow(w));
            w.addEventListener('focus', () => activateWindow(w));
            w.addEventListener('mousedown', () => activateWindow(w));

            const header = w.querySelector('header');
            if (header) {
                w.header = header;
                header.addEventListener('mousedown', e => dragStart(w, e));
                document.addEventListener('mouseup', e => dragEnd(w, e));
                document.addEventListener('mousemove', e => dragMove(w, e));
            }
        });
    });