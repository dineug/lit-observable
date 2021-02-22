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

function querySelector(
  selector: string,
  el: Element | null | undefined
): Element | null | undefined {
  const target = el?.querySelector(selector);
  return target ? target : el?.shadowRoot?.querySelector(selector);
}

function querySelectorAll(selector: string, elements: Element[]): Element[] {
  const target: Element[] = [];
  elements.forEach(element => {
    element.shadowRoot &&
      target.push(...element.shadowRoot.querySelectorAll(selector));
    target.push(...element.querySelectorAll(selector));
  });
  return target;
}

export function queryShadowSelector(
  selectors: string[],
  el: Element
): Element | null | undefined {
  if (!selectors.length) return;
  else if (selectors.length === 1) return querySelector(selectors[0], el);

  const nextSelectors = selectors.slice(0, selectors.length - 1);
  const lastSelector = selectors[selectors.length - 1];
  const lastElement = nextSelectors.reduce<Element | null | undefined>(
    (nextElement, nextSelector) => querySelector(nextSelector, nextElement),
    el
  );

  return querySelector(lastSelector, lastElement);
}

export function queryShadowSelectorAll(
  selectors: string[],
  el: Element
): Element[] {
  if (!selectors.length) return [];
  else if (selectors.length === 1) return querySelectorAll(selectors[0], [el]);

  const nextSelectors = selectors.slice(0, selectors.length - 1);
  const lastSelector = selectors[selectors.length - 1];
  const lastElements = nextSelectors.reduce<Array<Element>>(
    (nextElements, nextSelector) =>
      querySelectorAll(nextSelector, nextElements),
    [el]
  );

  return querySelectorAll(lastSelector, lastElements);
}
