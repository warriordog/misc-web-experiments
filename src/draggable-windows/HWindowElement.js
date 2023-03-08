import { extractSlotContent, fillSlots } from "./psuedoSlots.js";

/**
 * @typedef {import('./HWindowElement').ClientPosition} ClientPosition
 * @typedef {import('./HWindowElement').WindowDrag} WindowDrag
 */

export class HWindowElement extends HTMLElement {
    constructor() {
        super();
        this._isConstructed = false;

        // TODO these need to be inverted - default state is ON and therefore no attribute
        this._resizable = true;
        this._closable = true;
        this._zIndex = 0;
        this._windowTitle = '';

        /** @type {undefined | WindowDrag} */
        this._drag = undefined;

        // Create all components, but leave un-initialized
        this._title = document.createElement('h2');
        this._closeButton = document.createElement('button');
        this._header = document.createElement('header');
        this._body = document.createElement('div');
    }

    _construct() {
        this._windowTitle = this.getAttribute('window-title') || '';

        // Pull out any slot content *before* we modify the template
        const slotContent = extractSlotContent(this);

        this._title.classList.add('window-title');
        this._title.innerText = this._windowTitle;
        this._title.addEventListener('mousedown', e => {
            this._startDrag(e);
            e.preventDefault();
        });
        this._title.addEventListener('touchstart', e => {
            for (let touch of e.touches) {
                this._startDrag(touch);
            }
            e.preventDefault();
        });

        const headerSlot = document.createElement('slot');
        headerSlot.name = 'header';

        this._closeButton.classList.add('close-button');
        this._closeButton.addEventListener('click', () => this.close());
        this._closeButton.innerText = 'X';
        this._closeButton.title = "Close";

        this._header.classList.add('h-window-header');
        this._header.append(this._title, headerSlot, this._closeButton);

        const bodySlot = document.createElement('slot');

        this._body.classList.add('h-window-body');
        this._body.append(bodySlot);

        this.append(this._header, this._body);

        this.addEventListener('focusin', () => this.activate());
        this.addEventListener('focus', () => this.activate());
        this.addEventListener('mousedown', () => this.activate());
        this.addEventListener('touchstart', () => this.activate());

        // Template is fully built, now we populate slots
        fillSlots(this, slotContent);
    }

    get header() {
        return this._header;
    }

    get body() {
        return this._body;
    }

    get resizable() {
        return this._resizable;
    }
    set resizable(value) {
        this._resizable = value;
        this.toggleAttribute('resizable', value);

        this.style.resize = value ? 'both' : 'none';
    }

    get closable() {
        return this._closable;
    }
    set closable(value) {
        this._closable = value;
        this.toggleAttribute('closable', value);

        this._closeButton.disabled = !value;
    }

    get windowTitle() {
        return this._windowTitle;
    }
    set windowTitle(value) {
        this._windowTitle = value;
        this.setAttribute('window-title', value);

        this._title.innerText = value;
    }

    get zIndex() {
        return this._zIndex;
    }
    set zIndex(value) {
        this._zIndex = value;
        this.style.zIndex = String(value);
    }

    close() {
        if (!this._closable)
            return;

        if (this.isConnected) {
            this.remove();
            activateNewWindow(this.ownerDocument, null);
        }
    }

    activate() {
        if (this.isConnected) {
            activateNewWindow(this.ownerDocument, this);
        }
    }

    /**
     * @param {number} top
     * @param {number} left
     */
    move(top, left) {
        this.style.top = `${ top }px`;
        this.style.left = `${ left }px`;
    }

    /**
     * @param {ClientPosition} e
     * @private
     */
    _startDrag(e) {
        if (!this._drag) {
            const bounds = this.getBoundingClientRect();
            this._drag = {
                offsetX: e.clientX - bounds.left,
                offsetY: e.clientY - bounds.top
            };
        }

        this._header.style.cursor = 'dragging';
    }


    /**
     * @param {ClientPosition} e
     * @private
     */
    _endDrag(e) {
        this._moveDrag(e);

        this._drag = undefined;
        this._header.style.cursor = 'grab';
    }


    /**
     * @param {ClientPosition} e
     * @private
     */
    _moveDrag(e) {
        if (!this._drag)
            return;

        const newTop = e.clientY - this._drag.offsetY;
        const newLeft = e.clientX - this._drag.offsetX;

        this.move(newTop, newLeft);
    }

    /**
     * When it becomes connected, its connectedCallback is called, with no arguments.
     * https://html.spec.whatwg.org/multipage/custom-elements.html
     */
    connectedCallback() {
        if (this.isConnected) {
            this._connect(this.ownerDocument);

            if (!this._isConstructed) {
                this._isConstructed = true;
                this._construct();
            }
        }
    }

    /**
     * 4.13.6: When it is adopted into a new document, its adoptedCallback is called, given the old document and new document as arguments.
     * https://html.spec.whatwg.org/multipage/custom-elements.html
     *
     * @param {Document} oldDocument
     * @param {Document} newDocument
     */
    adoptedCallback(oldDocument, newDocument) {
        this._disconnect(oldDocument);
        this._connect(newDocument);
    }

    /**
     * When it becomes disconnected, its disconnectedCallback is called, with no arguments.
     * https://html.spec.whatwg.org/multipage/custom-elements.html
     */
    disconnectedCallback() {
        this._disconnect(this.ownerDocument);
    }

    /**
     * @param {Document} doc
     * @private
     */
    _connect(doc) {
        doc.addEventListener('mousemove', this._mouseMoveAdapter);
        doc.addEventListener('mouseup', this._mouseUpAdapter);
        doc.addEventListener('touchmove', this._touchMoveAdapter);
        doc.addEventListener('touchend', this._touchEndAdapter);
    }

    /**
     * @param {Document} doc
     * @private
     */
    _disconnect(doc) {
        doc.removeEventListener('mousemove', this._mouseMoveAdapter);
        doc.removeEventListener('mouseup', this._mouseUpAdapter);
        doc.removeEventListener('touchmove', this._touchMoveAdapter);
        doc.removeEventListener('touchend', this._touchEndAdapter);
    }

    /**
     * @param {MouseEvent} e
     * @private
     */
    _mouseUpAdapter = e => this._endDrag(e);

    /**
     * @param {MouseEvent} e
     * @private
     */
    _mouseMoveAdapter = e => this._moveDrag(e);

    /**
     * @param {TouchEvent} e
     * @private
     */
    _touchMoveAdapter = e => {
        for (let touch of e.changedTouches) {
            this._moveDrag(touch);
        }
    }

    /**
     * @param {TouchEvent} e
     * @private
     */
    _touchEndAdapter = e => {
        for (let touch of e.changedTouches) {
            this._endDrag(touch);
        }
    }

    /**
     * 4.13.6: When any of its attributes are changed, appended, removed, or replaced, its attributeChangedCallback is called, given the attribute's local name, old value, new value, and namespace as arguments.
     * (An attribute's old or new value is considered to be null when the attribute is added or removed, respectively.)
     * https://html.spec.whatwg.org/multipage/custom-elements.html
     *
     * @param {'resizable' | 'closable' | 'window-title'} name
     * @param {string | null} oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;

        if (name === 'resizable')
            this.resizable = newValue !== null;
        else if (name === 'closable')
            this.closable = newValue !== null;
        else if (name === 'window-title')
            this.windowTitle = newValue || '';
        else
            console.warn('HWindowElement.attributeChangedCallback: Unsupported attribute:', { name, oldValue, newValue });
    }

    static get observedAttributes() {
        return [ 'resizable', 'closable', 'window-title' ];
    }
}

/**
 * @param {Document} doc
 * @param {HWindowElement | null} newActive
 */
function activateNewWindow(doc, newActive) {
    // Find all windows & prioritize by their current z-index.
    // New active window (if provided) is automatically moved to the end (top).
    // A bit of a hack, but it works.
    const windows = Array
        .from(doc.querySelectorAll('h-window'))
        .sort((w1, w2) => {
            if (w1 === w2) return 0;
            if (w1 === newActive) return 1;
            if (w2 === newActive) return -1;
            if (w1 === null) return 1;
            if (w2 === null) return -1;
            return w1.zIndex - w2.zIndex;
        });

    // Sync window state with new sorted list
    for (let idx = 0; idx < windows.length; idx++) {
        const isActive = idx === windows.length - 1;
        const win = windows[idx];

        win.zIndex = idx;
        win.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    }
}

// Register the custom element
if (window.customElements && !customElements.get('h-window')) {
    customElements.define('h-window', HWindowElement);
}
