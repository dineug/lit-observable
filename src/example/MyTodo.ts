import './TodoList';
import { TodoProviderElement } from './TodoProvider';
import { html, defineComponent, query } from '@/core';

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

    const add = () => {
      const todoProvider = todoProviderRef.value;
      if (todoProvider) {
        todoProvider.value.add({ name: `${Math.random()}` });
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
