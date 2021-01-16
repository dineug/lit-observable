# lit-observable

> lit-html + reactive

[![npm version](https://img.shields.io/npm/v/@dineug/lit-observable.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/vuerd) [![GitHub](https://img.shields.io/github/license/vuerd/vuerd?style=flat-square&color=blue)](https://github.com/vuerd/vuerd/blob/master/LICENSE)

## Install

```bash
$ yarn add @dineug/lit-observable
or
$ npm install @dineug/lit-observable
```

## Usage

```javascript
import { defineComponent, html } from "@dineug/lit-observable";

defineComponent("my-counter", {
  shadow: { mode: "closed" },
  render() {
    const state = observable({ count: 0 });

    const onIncrement = () => {
      state.count++;
    };

    return () => html`
      <button @click=${onIncrement}>Increment</button>
      <span>${state.count}</span>
    `;
  },
});

const myCounter = document.createElement("my-counter");
document.body.appendChild(myCounter);
```
