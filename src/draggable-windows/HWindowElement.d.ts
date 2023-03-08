/**
 * HTML Window.
 * Tag: <h-window>
 */
export class HWindowElement extends HTMLElement {
    /**
     * If true, the window can be resized.
     */
    resizable: boolean;

    /**
     * If true, the window titlebar includes a close button.
     */
    closable: boolean;

    /**
     * String to display in the window's titlebar
     */
    windowTitle: string;

    /**
     * Vertical (z-index) position of the window
     */
    zIndex: number;

    /**
     * The window's header bar
     */
    get header(): HTMLElement;

    /**
     * The window's body section
     */
    get body(): HTMLElement;

    /**
     * Closes the window and detaches it from the document
     */
    close(): void;

    /**
     * Brings the window to the front of any other windows
     */
    activate(): void;

    /**
     * Moves the window to a specified position
     * @param top Distance from the top of the screen
     * @param left Distance from the left of the screen
     */
    move(top: number, left: number): void;
}

export interface WindowDrag {
    readonly offsetX: number;
    readonly offsetY: number;
}

export interface ClientPosition {
    readonly clientX: number;
    readonly clientY: number;
}

declare global {
    interface HTMLElementTagNameMap {
        'h-window': HWindowElement
    }
}