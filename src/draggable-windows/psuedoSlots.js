import {isElement} from "./util.js";

export const defaultSlot = Symbol('defaultSlot');

/**
 * @param {Element} element
 * @returns {Map<string | Symbol, Node[]>}
 */
export function extractSlotContent(element) {
    /** @type {Map<string | Symbol, Node[]>} */
    const map = new Map();

    while (element.lastChild) {
        const child = element.lastChild;
        const slot = (isElement(child) && child.slot) ? child.slot : defaultSlot;

        let list = map.get(slot);
        if (!list) {
            list = [];
            map.set(slot, list);
        }

        // Insert at the beginning because we are working in reverse
        list.unshift(child);

        child.remove();
    }

    return map;
}

/**
 *
 * @param {Element} element
 * @param {Map<string | Symbol, Node[]>} content
 * @param {boolean} [defaultFallback]
 */
export function fillSlots(element, content, defaultFallback = false) {
    // Find all slots in the template element
    Array
        .from(element.querySelectorAll('slot'))
        .forEach(slot => {
            // Get lookup key
            const key = slot.name || defaultSlot;

            // Find replacement content.
            // It can be empty after this, but that's OK.
            const replacements = content.get(key) || Array.from(slot.children);

            // Replace the slot
            slot.replaceWith(...replacements)
        });
}
