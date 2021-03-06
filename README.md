# lit-observable

> lit-html + reactive

[![npm version](https://img.shields.io/npm/v/@dineug/lit-observable.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@dineug/lit-observable) [![GitHub](https://img.shields.io/github/license/dineug/lit-observable?style=flat-square&color=blue)](https://github.com/dineug/lit-observable/blob/main/LICENSE)

## Document

- [example](https://github.com/dineug/lit-observable/tree/main/src/example)

## Install

```bash
$ yarn add @dineug/lit-observable
or
$ npm install @dineug/lit-observable
```

## Usage

```javascript
import { defineComponent, html, observable } from '@dineug/lit-observable';

defineComponent('my-counter', {
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

const myCounter = document.createElement('my-counter');
document.body.appendChild(myCounter);
```
