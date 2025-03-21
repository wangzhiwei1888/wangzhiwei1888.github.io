---
title: react useRef
date: 2025-03-21 17:26:23
tags:
---


`useRef` 是 React 中的一个 Hook，用于在函数组件中创建一个引用（ref），该引用可以在组件渲染之间保持不变。`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。这个 ref 可以用于访问 DOM 元素，也可以用于保存任何持久化的信息。

以下是 `useRef` 的一些常见使用场景和示例：

### 1. 访问 DOM 元素
`useRef` 可以用来直接操作 DOM 元素，类似于类组件中的 `ref`。

```jsx
import React, { useRef } from 'react';

function InputFocus() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}

export default InputFocus;
```

### 2. 保存变量
`useRef` 可以用来保存一个变量，并且在组件重新渲染时不会重置该变量的值。

```jsx
import React, { useRef, useEffect } from 'react';

function Counter() {
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = 0;
  }, []);

  const increment = () => {
    countRef.current += 1;
    console.log('计数:', countRef.current);
  };

  return (
    <div>
      <button onClick={increment}>点击计数</button>
    </div>
  );
}

export default Counter;
```

### 3. 管理计时器或其他副作用
`useRef` 可以用来管理计时器或其他需要在组件卸载时清理的副作用。

```jsx
import React, { useRef, useEffect } from 'react';

function Timer() {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('定时器运行中...');
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return <div>定时器正在运行</div>;
}

export default Timer;
```

### 4. 父子组件通信
`useRef` 可以用来在父子组件之间传递引用，实现直接操作子组件的 DOM 或方法。

```jsx
import React, { useRef } from 'react';

// 子组件
function ChildComponent({ setRef }) {
  return <div ref={setRef}>子组件</div>;
}

// 父组件
function ParentComponent() {
  const childRef = useRef(null);

  const handleClick = () => {
    console.log('子组件的 DOM:', childRef.current);
  };

  return (
    <div>
      <ChildComponent setRef={childRef} />
      <button onClick={handleClick}>获取子组件 DOM</button>
    </div>
  );
}

export default ParentComponent;
```

### 5. 保存上一个状态
`useRef` 可以用来保存组件的上一个状态，类似于 `useState` 的前一个值。

```jsx
import React, { useState, useRef, useEffect } from 'react';

function PreviousState() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>当前计数: {count}</p>
      <p>上一个计数: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
    </div>
  );
}

export default PreviousState;
```

### 总结
`useRef` 是一个非常灵活的 Hook，可以用于多种场景，包括操作 DOM、保存变量、管理计时器、父子组件通信以及保存上一个状态等。它的主要特点是：
- `.current` 属性在组件渲染之间保持不变。
- 不会触发组件的重新渲染。
- 可以直接修改 `.current` 属性的值。

通过以上示例，你可以更好地理解和使用 `useRef` 来解决实际开发中的问题。


在 React 中，`useRef` 可以用来调用子组件的方法。为了实现这一点，你需要在子组件中使用 `forwardRef` 和 `useImperativeHandle` 来暴露方法给父组件。以下是一个示例：

### 示例：使用 `useRef` 调用子组件的方法

#### 子组件
```jsx
import React, { forwardRef, useImperativeHandle } from 'react';

// 子组件
const ChildComponent = forwardRef((props, ref) => {
  // 定义要暴露给父组件的方法
  const greet = () => {
    console.log('子组件说：你好！');
  };

  const get_data = () => {
    console.log('子组件的数据');
  };

  // 使用 useImperativeHandle 暴露方法
  useImperativeHandle(ref, () => ({
    greet,
    get_data
  }));

  return <div>子组件</div>;
});

export default ChildComponent;
```

#### 父组件
```jsx
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

// 父组件
function ParentComponent() {
  const childRef = useRef(null);

  const handleGreet = () => {
    childRef.current.greet();
  };

  const handleGetdata = () => {
    childRef.current.get_data();
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleGreet}>调用子组件的 greet 方法</button>
      <button onClick={handleGetdata}>调用子组件的 get_data 方法</button>
    </div>
  );
}

export default ParentComponent;
```

### 代码说明

1. **子组件**：
   - 使用 `forwardRef` 来转发 `ref`。
   - 使用 `useImperativeHandle` 来暴露特定的方法给父组件。在这个例子中，我们暴露了 `greet` 和 `get_data` 方法。

2. **父组件**：
   - 使用 `useRef` 创建一个引用 `childRef`。
   - 将 `childRef` 传递给子组件的 `ref` 属性。
   - 通过 `childRef.current` 调用子组件中暴露的方法。

### 注意事项

- **`forwardRef` 和 `useImperativeHandle`**：这两个 API 是关键，`forwardRef` 用于将 `ref` 转发到子组件，而 `useImperativeHandle` 用于定义哪些方法或值可以被父组件访问。
- **性能**：直接操作子组件的方法可能会破坏组件的封装性，应谨慎使用。尽量通过 props 和状态管理来实现组件间的交互。
- **类型检查**：如果使用 TypeScript，可以为 `ref` 定义类型，以确保类型安全。

通过这种方式，你可以在父组件中使用 `useRef` 调用子组件的方法，实现更灵活的组件交互。