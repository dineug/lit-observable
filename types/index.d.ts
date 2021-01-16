import { TemplateResult, SVGTemplateResult } from "lit-html";

type Template = () => TemplateResult | SVGTemplateResult;

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

declare function defineComponent(name: string, options: Options): void;

declare function closestElement(selector: string, el: any): Element | null;

type PropName = string | number | symbol;
type Observer = () => void;
export type Unsubscribe = () => void;
type SubjectObserver<T> = (value: T) => void;

export interface Subject<T> {
  next(value: T): void;
  subscribe(observer: SubjectObserver<T>): Unsubscribe;
}

declare function observable<T>(raw: T): T;
declare function observer(f: Observer): Unsubscribe;
declare function createSubject<T>(): Subject<T>;
declare function watch(
  proxy: any,
  observer: SubjectObserver<PropName>
): Unsubscribe;
