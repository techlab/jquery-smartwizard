import { ContentDirection } from "./types";

export function getFirstDescendant(element: JQuery, selector: string) {
    // Check for first level element
    let elm = element.children(selector);
    if (elm.length > 0) {
        return elm;
    }

    // Check for second level element
    element.children().each((_i: number, n: HTMLElement) => {
        let tmp = $(n).children(selector);
        if (tmp.length > 0) {
            elm = tmp;
            return false;
        }
    });
    if (elm.length > 0) {
        return elm;
    }

    // Element not found
    throw new Error(`Element not found ${selector}`);
};

export function getContentDirection(element: JQuery): ContentDirection {
    return element.prop('dir') || document.documentElement.dir || '';
}

export function setContentDirection(element: JQuery, direction: ContentDirection) {
    element.prop('dir', direction);
}

export function triggerEvent(element: JQuery, name: string, params: any = []) {
    console.log('triggerEvent', name, params);
    // Trigger an event
    const e = $.Event(name);
    element.trigger(e, params);
    return e.isDefaultPrevented();
}

export function getURLHashIndex() {
    // Get step number from url hash if available
    return window.location.hash || '';
}

export function setURLHash(hash: string) {
    // if (this.options.enableUrlHash && window.location.hash !== hash) {
        history.pushState(null, '', hash);
    // }
}

export function scrollToView(elm: any) {
    elm.get(0).scrollIntoView({ behavior: "smooth" });
}