import { TemplateResult, SVGTemplateResult } from 'lit-html';

export type Callback = () => void;
export type Template = () => TemplateResult | SVGTemplateResult;
export type FunctionalComponent<P = any, T = HTMLElement> = (
  this: HTMLElement,
  props: P,
  ctx: T
) => Template;

export interface Options {
  observedProps?: string[];
  shadow?: ShadowRootMode | false;
  style?: string;
  render: FunctionalComponent<any, any>;
}

export interface Ref<T> {
  value: T;
}

export declare function beforeMount(callback: Callback): void;
export declare function mounted(callback: Callback): void;
export declare function unmounted(callback: Callback): void;
export declare function updated(callback: Callback): void;
export declare function query<T = any>(selector: string): Ref<T>;
export declare function queryAll<T = any>(selector: string): Ref<T>;
export declare function defineComponent(name: string, options: Options): void;
