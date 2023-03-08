/**
 * HTML Window.
 * Tag: <h-window>
 */
export class HWindowElement extends HTMLElement {
    /**
     * Sets the available resize options.
     * Defaults to "both".
     */
    resizable: ResizableValue;

    /**
     * If true, disables the drag function.
     * Does not apply to move() function.
     */
    disableMove: boolean;

    /**
     * If true, disables the close button.
     * Does not apply to close() function.
     */
    disableClose: boolean;

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
     * Sets the window to a specified size
     */
    resize(height: number, width: number): void;

    /**
     * Moves the window to a specified position
     * @param top Distance from the top of the screen
     * @param left Distance from the left of the screen
     */
    move(top: number, left: number): void;

    /**
     * Brings the window to the front of any other windows
     */
    activate(): void;
}

export type ResizableValue = 'none' | 'both' | 'horizontal' | 'vertical';
export type ResizableLookup = Record<string, ResizableValue>;

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