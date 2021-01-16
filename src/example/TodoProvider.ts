import { ProviderElement } from '@type/context';
import { html, defineComponent, getContext } from '@/core';
import { Store } from './Store';

export interface TodoProviderElement extends ProviderElement<Store> {}

defineComponent('todo-provider', {
  render(_, ctx: TodoProviderElement) {
    ctx.value = new Store();
    return () => html`<slot></slot>`;
  },
});

export const getTodoContext = <T>(el: Element) =>
  getContext<T>('todo-provider', el);
