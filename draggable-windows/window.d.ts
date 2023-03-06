interface Array<T> {
    remove(value: T): T[];
}

interface Document {
    whenReady(): Promise<void>;
}

interface WindowElement extends HTMLDivElement {
    // Window's header bar
    header: HTMLElement;

    // True if this window is on top
    active?: boolean;

    // Tracks metadata for an active drag operation
    drag?: {
        // X (left) position *within the window* where the drag started
        offsetX: number;

        // Y (top) position *within the window* where the drag started
        offsetY: number;
    };

}