import { render, html, TemplateResult, SVGTemplateResult } from 'lit-html';
import { observable, observer, Unsubscribe } from './observable';

const BEFORE_MOUNT = Symbol('beforeMount');
const MOUNTED = Symbol('mounted');
const UNMOUNTED = Symbol('unmounted');
const UPDATED = Symbol('updated');
const RENDER_ROOT = Symbol('renderRoot');
const TEMPLATE = Symbol('template');
const STYLE = Symbol('style');
const PROPS = Symbol('props');
const UNSUBSCRIBE = Symbol('unsubscribe');
const QUERY = Symbol('query');
const QUERY_ALL = Symbol('queryAll');

type LifecycleName =
  | typeof BEFORE_MOUNT
  | typeof MOUNTED
  | typeof UNMOUNTED
  | typeof UPDATED;
type QueryName = typeof QUERY | typeof QUERY_ALL;
type Callback = () => void;
type Template = () => TemplateResult | SVGTemplateResult;
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

interface Component {
  [BEFORE_MOUNT]: Callback[] | null;
  [MOUNTED]: Callback[] | null;
  [UNMOUNTED]: Callback[] | null;
  [UPDATED]: Callback[] | null;
  [QUERY]: Callback[] | null;
  [UNSUBSCRIBE]: Unsubscribe[];
  [RENDER_ROOT]: ShadowRoot | HTMLElement;
  [TEMPLATE]: Template;
  [STYLE]: HTMLStyleElement | null;
  [PROPS]: any;
}

let currentInstance: Component | null = null;

const createLifecycle = (name: LifecycleName) => (f: Callback) => {
  currentInstance &&
    (currentInstance[name] ?? (currentInstance[name] = [])).push(f);
};
const createQuery = (name: QueryName) => <T = any>(
  selector: string
): Ref<T> => {
  const ref = { value: null } as Ref<any>;

  if (currentInstance) {
    const renderRoot = currentInstance[RENDER_ROOT];
    const f = () =>
      (ref.value =
        name === QUERY
          ? renderRoot.querySelector(selector)
          : [...renderRoot.querySelectorAll(selector)]);

    (currentInstance[QUERY] ?? (currentInstance[QUERY] = [])).push(f);
  }

  return ref;
};

export const beforeMount = createLifecycle(BEFORE_MOUNT);
export const mounted = createLifecycle(MOUNTED);
export const unmounted = createLifecycle(UNMOUNTED);
export const updated = createLifecycle(UPDATED);
export const query = createQuery(QUERY);
export const queryAll = createQuery(QUERY_ALL);

export function defineComponent(name: string, options: Options) {
  const C = class extends HTMLElement implements Component {
    static get observedAttributes() {
      return options.observedProps ?? [];
    }

    [BEFORE_MOUNT]: Callback[] | null = null;
    [MOUNTED]: Callback[] | null = null;
    [UNMOUNTED]: Callback[] | null = null;
    [UPDATED]: Callback[] | null = null;
    [QUERY]: Callback[] | null = null;
    [UNSUBSCRIBE]: Unsubscribe[] = [];
    [RENDER_ROOT]!: ShadowRoot | HTMLElement;
    [TEMPLATE]: Template;
    [STYLE]: HTMLStyleElement | null = null;
    [PROPS] = observable({}) as any;

    constructor() {
      super();

      this[RENDER_ROOT] = options.shadow
        ? this.attachShadow(options.shadow)
        : document.createElement('div');

      if (options.style) {
        const style = document.createElement('style');
        style.textContent = options.style;
        this[STYLE] = style;
      }

      currentInstance = this;
      this[TEMPLATE] = options.render.call(this, this[PROPS], this);
      currentInstance = null;
    }

    connectedCallback() {
      this[BEFORE_MOUNT]?.forEach(f => f());

      options.shadow ?? this.appendChild(this[RENDER_ROOT]);

      let isMounted = false;
      this[UNSUBSCRIBE].push(
        observer(() => {
          render(html`${this[STYLE]}${this[TEMPLATE]()}`, this[RENDER_ROOT]);
          this[QUERY]?.forEach(f => f());

          isMounted ? this[UPDATED]?.forEach(f => f()) : (isMounted = true);
        })
      );

      this[MOUNTED]?.forEach(f => f());
    }

    disconnectedCallback() {
      this[UNSUBSCRIBE].forEach(f => f());
      this[UNSUBSCRIBE] = [];
      this[UNMOUNTED]?.forEach(f => f());
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      this[PROPS][name] = newValue;
    }
  };

  options.observedProps?.forEach(propName => {
    Object.defineProperty(C.prototype, propName, {
      get() {
        return this[PROPS][propName];
      },
      set(value) {
        this[PROPS][propName] = value;
      },
    });
  });

  customElements.define(name, C);
}
