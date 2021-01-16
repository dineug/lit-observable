import { html } from "lit-html";
import { defineComponent } from "@/core";
import { Todo } from "./Store";

interface TodoItemProps {
  todo: Todo;
}

defineComponent("todo-item", {
  shadow: { mode: "open" },
  observedProps: ["todo"],
  render(props: TodoItemProps) {
    return () => html`<li>${props.todo.name}</li>`;
  },
});
