export class HWindowElement extends HTMLElement {
    resizable: boolean;
    closable: boolean;
    windowTitle: boolean;

    get header(): HTMLElement;
    get body(): HTMLElement;

    close(): void;
    activate(): void;
    move(top: number, left: number): void;
}

interface ParentNode {
    querySelector(selectors: 'h-window'): HWindowElement | null;
    querySelectorAll(selectors: 'h-window'): NodeListOf<HWindowElement>;
}

interface Document extends ParentNode {
    createElement(tagName: 'h-window', options?: ElementCreationOptions): HWindowElement;
}
