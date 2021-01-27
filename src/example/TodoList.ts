import './TodoItem';
import { html, defineComponent } from '@/core';
import { getTodoContext } from './TodoProvider';

declare global {
  interface HTMLElementTagNameMap {
    'todo-list': TodoListElement;
  }
}

interface TodoListElement extends HTMLElement {}

defineComponent('todo-list', {
  render(_, ctx: TodoListElement) {
    const store = getTodoContext(ctx);

    return () => html`
      <ul>
        ${store.list.map(todo => html`<todo-item .todo=${todo}></todo-item>`)}
      </ul>
    `;
  },
});
