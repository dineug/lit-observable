import { TemplateResult, SVGTemplateResult } from "lit-html";
export * from "lit-html";

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
  mode: "open" | "closed";
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

declare function beforeMount(callback: Callback): void;
declare function mounted(callback: Callback): void;
declare function unmounted(callback: Callback): void;
declare function updated(callback: Callback): void;
declare function query<T = any>(selector: string): Ref<T>;
declare function queryAll<T = any>(selector: string): Ref<T>;
declare function defineComponent(name: string, options: Options): void;
declare function getContext<T = any>(selector: string, el: Element): T;
declare function closestElement(selector: string, el: any): Element | null;
declare function observable<T>(raw: T): T;
declare function observer(f: Observer): Unsubscribe;
declare function createSubject<T>(): Subject<T>;
declare function watch(
  proxy: any,
  observer: SubjectObserver<PropName>
): Unsubscribe;
