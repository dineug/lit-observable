import { ProviderElement } from '@type/context';
import { html, defineComponent, getContext } from '@/core';
import { Store } from './Store';

declare global {
  interface HTMLElementTagNameMap {
    'todo-provider': TodoProviderElement;
  }
}

export interface TodoProviderElement extends ProviderElement<Store> {}

defineComponent('todo-provider', {
  render(_, ctx: TodoProviderElement) {
    ctx.value = new Store();
    return () => html`<slot></slot>`;
  },
});

export const getTodoContext = (el: Element) =>
  getContext<Store>('todo-provider', el);
