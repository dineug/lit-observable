import { TemplateResult, SVGTemplateResult } from 'lit-html';
export { html, svg, TemplateResult, SVGTemplateResult } from 'lit-html';

type Callback = () => void;
type Template = () => TemplateResult | SVGTemplateResult;
type PropName = string | number | symbol;
type Observer = () => void;
type SubjectObserver<T> = (value: T) => void;
export type Unsubscribe = () => void;
export type FunctionalComponent<P = any, T = HTMLElement> = (
  this: HTMLElement,
  props: P,
  ctx: T
) => Template;

interface ShadowOptions {
  mode: 'open' | 'closed';
}
interface Options {
  observedProps?: string[];
  shadow?: ShadowOptions;
  style?: string;
  render: FunctionalComponent<any, any>;
}
interface Ref<T> {
  value: T;
}
export interface Subject<T> {
  next(value: T): void;
  subscribe(observer: SubjectObserver<T>): Unsubscribe;
}
export interface ProviderElement<T> extends HTMLElement {
  value: T;
}

export declare function beforeMount(callback: Callback): void;
export declare function mounted(callback: Callback): void;
export declare function unmounted(callback: Callback): void;
export declare function updated(callback: Callback): void;
export declare function query<T = any>(selector: string): Ref<T>;
export declare function queryAll<T = any>(selector: string): Ref<T>;
export declare function defineComponent(name: string, options: Options): void;
export declare function getContext<T = any>(selector: string, el: Element): T;
export declare function closestElement(
  selector: string,
  el: any
): Element | null;
export declare function observable<T>(raw: T): T;
export declare function observer(f: Observer): Unsubscribe;
export declare function createSubject<T>(): Subject<T>;
export declare function watch(
  proxy: any,
  observer: SubjectObserver<PropName>
): Unsubscribe;
