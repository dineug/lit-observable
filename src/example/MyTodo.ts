import './TodoList';
import { TodoProviderElement } from './TodoProvider';
import { Store } from './Store';
import { html, defineComponent, mounted, query } from '@/core';

declare global {
  interface HTMLElementTagNameMap {
    'my-todo': MyTodoElement;
  }
}

interface MyTodoElement extends HTMLElement {}

defineComponent('my-todo', {
  shadow: 'closed',
  render() {
    const todoProviderRef = query<TodoProviderElement>('todo-provider');
    let store: Store | null = null;

    mounted(() => {
      const todoProvider = todoProviderRef.value;
      store = todoProvider.value;
    });

    const add = () => {
      if (store) {
        store.add({ name: `${Math.random()}` });
      }
    };

    return () => html`
      <todo-provider>
        <button @click=${add}>add</button>
        <todo-list></todo-list>
      </todo-provider>
    `;
  },
});
