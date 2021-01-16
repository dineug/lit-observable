import { Callback, Template, Options, Ref } from '@type/defineComponent';
import { Unsubscribe } from '@type/observable';
import { render, html } from 'lit-html';
import { observable, observer } from './observable';
import { isSheet, isStyle } from './styleSheets';

const BEFORE_MOUNT = Symbol('beforeMount');
const MOUNTED = Symbol('mounted');
const UNMOUNTED = Symbol('unmounted');
const UPDATED = Symbol('updated');
const QUERY = Symbol('query');
const QUERY_ALL = Symbol('queryAll');
const UNSUBSCRIBE = Symbol('unsubscribe');
const RENDER_ROOT = Symbol('renderRoot');
const TEMPLATE = Symbol('template');
const STYLE = Symbol('style');
const PROPS = Symbol('props');

type LifecycleName =
  | typeof BEFORE_MOUNT
  | typeof MOUNTED
  | typeof UNMOUNTED
  | typeof UPDATED;
type QueryName = typeof QUERY | typeof QUERY_ALL;

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
  options.shadow ?? (options.shadow = 'open');
  const sheet = isSheet(options) ? new CSSStyleSheet() : null;
  sheet && sheet.replaceSync(options.style || '');

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
        ? this.attachShadow({ mode: options.shadow })
        : document.createElement('div');

      if (isStyle(options)) {
        const style = document.createElement('style');
        style.textContent = options.style || '';
        this[STYLE] = style;
      }

      if (sheet) {
        (this[RENDER_ROOT] as ShadowRoot).adoptedStyleSheets = [sheet];
      }

      currentInstance = this;
      this[TEMPLATE] = options.render.call(this, this[PROPS], this);
      currentInstance = null;
    }

    connectedCallback() {
      this[BEFORE_MOUNT]?.forEach(f => f());

      if (!options.shadow) {
        this[STYLE] && this.appendChild(this[STYLE] as HTMLStyleElement);
        this.appendChild(this[RENDER_ROOT]);
      }

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
