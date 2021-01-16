import { html, defineComponent } from '@/core';
import { Todo } from './Store';

interface TodoItemProps {
  todo: Todo;
}

defineComponent('todo-item', {
  observedProps: ['todo'],
  render(props: TodoItemProps) {
    return () => html`<li>${props.todo.name}</li>`;
  },
});
