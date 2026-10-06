import { ContentDirection, StepEventArgs, LeaveStepEventArgs } from "./types";

// TypeScript Util
/**
 * Gets the current URL hash (including #).
 */
export function getUrlHash(): string {
    return window.location.hash || '';
}

/**
 * Sets the URL hash without reloading the page.
 */
export function setUrlHash(hash: string): void {
    history.pushState(null, '', hash);
}

/**
 * Scrolls an element into view smoothly.
 */
export function scrollToView(element: JQuery): void {
    element[0]?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Determines if a value is a function.
 */
export function isFunction(value: unknown): boolean {
    return typeof value === "function";
}

/**
 * Recursively merges `override` into a deep clone of `base`.
 * Plain-object values are merged key-by-key; all other values are replaced.
 */
export function deepMerge<T extends object>(base: T, override: Partial<T>): T {
    // Helper to deep clone objects/arrays
    const deepClone = <V>(val: V): V => {
        if (val === null || typeof val !== 'object') {
            return val;
        }

        if (Array.isArray(val)) {
            return val.map(deepClone) as unknown as V;
        }

        const clone = {} as Record<string, unknown>;
        for (const key of Object.keys(val)) {
            clone[key] = deepClone((val as Record<string, unknown>)[key]);
        }
        return clone as unknown as V;
    };

    const result = deepClone(base) as Record<string, unknown>;
    for (const key of Object.keys(override) as (keyof T)[]) {
        const baseVal = result[key as string];
        const overrideVal = override[key];

        if (
            overrideVal !== null &&
            typeof overrideVal === 'object' &&
            !Array.isArray(overrideVal) &&
            baseVal !== null &&
            typeof baseVal === 'object' &&
            !Array.isArray(baseVal)
        ) {
            result[key as string] = deepMerge(
                baseVal as object,
                overrideVal as Partial<object>
            );
        } else if (overrideVal !== undefined) {
            result[key as string] = deepClone(overrideVal);
        }
    }
    return result as T;
}


// jQuery Util

/**
 * Finds the first matching descendant in one of the first two levels of children.
 */
export function getFirstDescendant(element: JQuery, selector: string): JQuery {
    // Check for first level element
    const firstLevel = element.children(selector);
    if (firstLevel.length > 0) {
        return firstLevel;
    }

    // Check for second level element
    let result: JQuery | null = null;
    element.children().each((_i: number, node: HTMLElement) => {
        const secondLevel = $(node).children(selector);
        if (secondLevel.length > 0) {
            result = secondLevel;
            return false; // Break the loop
        }
    });

    if (result) {
        return result;
    }

    // Element not found
    throw new Error(`Element not found ${selector}`);
}

/**
 * Gets the text direction from an element or falls back to document.
 */
export function getContentDirection(element: JQuery): ContentDirection {
    return element.prop('dir') || document.documentElement.dir || '';
}

/**
 * Sets the text direction of an element.
 */
export function setContentDirection(element: JQuery, direction: ContentDirection): void {
    element.prop('dir', direction);
}

/**
 * Triggers a jQuery event and returns whether default was prevented.
 */
export function triggerEvent(element: JQuery, name: string, args: StepEventArgs | LeaveStepEventArgs | any[] = []): boolean {
    // Trigger an event
    const event = $.Event(name);
    element.trigger(event, args);
    return !event.isDefaultPrevented();
}

export function stopAnimations(...elements: JQuery<HTMLElement>[]) {
    if (!isFunction($.fn.finish)) { return; }

    $(elements).finish();
}