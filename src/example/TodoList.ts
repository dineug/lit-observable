import './TodoItem';
import { html, defineComponent } from '@/core';
import { getTodoContext } from './TodoProvider';
import { Store } from './Store';

defineComponent('todo-list', {
  render(_, ctx) {
    const store = getTodoContext<Store>(ctx);

    return () => html`
      <ul>
        ${store.list.map(todo => html`<todo-item .todo=${todo}></todo-item>`)}
      </ul>
    `;
  },
});
