import "./TodoList";
import { TodoProviderElement } from "./TodoProvider";
import { html } from "lit-html";
import { defineComponent, query } from "@/core";

defineComponent("my-todo", {
  shadow: { mode: "closed" },
  render() {
    const todoProviderRef = query<TodoProviderElement>("todo-provider");

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
