export const defaultSlot: Symbol;

export type SlotContent = Map<string | Symbol, Node[]>;

/**
 * Extracts slot content from the initial state of an element.
 * All children of the provided element will be grouped by their slot attribute and returned as a map.
 * Any children without a slot attribute will be collected into the default slot, which can be accessed with the defaultSlot symbol key.
 * Children will be detached from the DOM.
 * @param element Element to extract children from
 */
export function extractSlotContent(element: Element): SlotContent;

/**
 * Replaces <slot> elements in a target element with a provided collection of content.
 *
 * If no content for a slot is found, then the fallback content will be promoted.
 * If there is no fallback content, then the slot is removed entirely.
 *
 * Content with a slot not found in the target element will not be inserted unless defaultFallback is set to true.
 *
 * @param element Element to populate
 * @param content Content to insert
 * @param defaultFallback If true, unmatched slot content will be directed into the default slot.
 */
export function fillSlots(element: Element, content: SlotContent, defaultFallback?: boolean): void;
