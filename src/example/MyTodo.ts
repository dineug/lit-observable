import './TodoList';
import { TodoProviderElement } from './TodoProvider';
import { html, defineComponent, query } from '@/core';

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
        <div>test</div>
        <button @click=${add}>add</button>
        <todo-list></todo-list>
      </todo-provider>
    `;
  },
});
