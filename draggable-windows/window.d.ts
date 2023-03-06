interface Array<T> {
    remove(value: T): T[];
}

interface Document {
    whenReady(): Promise<void>;
}

interface WindowElement extends HTMLDivElement {
    header: HTMLElement;
    active?: boolean;
    drag?: {
        offsetX: number;
        offsetY: number;
    };

}