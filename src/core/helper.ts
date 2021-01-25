export const isObject = (obj: any) => !!obj && typeof obj === 'object';
export const isArray = (obj: any) => Array.isArray(obj);
export const isUndefined = (value: any) => value === undefined;
export const closestElement = (
  selector: string,
  el: any,
  target = el && el.closest(selector)
): Element | null =>
  !el || el === document || el === window
    ? null
    : target
    ? target
    : closestElement(selector, el.getRootNode().host);
