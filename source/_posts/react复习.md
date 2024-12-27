---
title: react复习
date: 2024-12-27 14:17:09
tags:
    - react
categories:
    - react
    - javascript
---


### react 复习 （v16.8.0） 目前版本为 19.0.0， demo是在 19.0.0环境下运行


### 什么是无状态组件，什么是有状态组件？


在React中，组件可以根据其是否包含状态（state）分为无状态组件和有状态组件。

- **无状态组件（Stateless Component）**：
  - 也称为纯函数组件（Functional Component），因为它通常是一个简单的JavaScript函数。
  - 不包含内部状态（state），也不使用生命周期方法。
  - 只根据传入的属性（props）来渲染UI，不会因为自身的状态变化而重新渲染。
  - 示例代码：
    ```javascript
    function Welcome(props) {
      return <h1>Hello, {props.name}</h1>;
    }
    ```

- **有状态组件（Stateful Component）**：
  - 通常是指类组件（Class Component），虽然函数组件也可以通过使用`useState`等Hooks拥有状态。
  - 包含内部状态（state），可以管理并响应数据的变化。
  - 可以定义和使用生命周期方法，如`componentDidMount`、`componentDidUpdate`等。
  - 示例代码：
    ```javascript
    class Welcome extends React.Component {
      constructor(props) {
        super(props);
        this.state = { name: 'World' };
      }

      componentDidMount() {
        // 组件挂载后的操作
      }

      render() {
        return <h1>Hello, {this.state.name}</h1>;
      }
    }
    ```

随着React Hooks的引入，函数组件也可以拥有状态和其他特性，因此这种区分逐渐变得不那么严格。


### pureComponent  和 memo 能够对比传入属性是否有变化，如果变化了，就重新渲染，否则不渲染。
是否有变化是如何判定的？ undefined 算不算相等


在React中，`PureComponent` 和 `memo` 都用于优化组件的渲染性能，通过浅比较（shallow comparison）传入的属性（props）或状态（state），以决定是否需要重新渲染。

- 浅比较的判定方式

- **浅比较**：只比较对象的第一层属性，不会递归地深入比较嵌套的对象或数组。
- **基本类型**（如数字、字符串、布尔值、`null`、`undefined`）：
  - 直接使用严格相等运算符（`===`）进行比较。
  - 对于`undefined`，如果两个值都是`undefined`，则认为它们是相等的。

- `PureComponent` 和 `memo` 的具体行为

1. **`PureComponent`**：
   - 只适用于类组件。
   - 自动对`this.props`和`this.state`进行浅比较。
   - 如果浅比较结果显示没有变化，则跳过组件的重新渲染。

2. **`memo`**：
   - 适用于函数组件。
   - 默认情况下，对组件的`props`进行浅比较。
   - 如果浅比较结果显示没有变化，则跳过组件的重新渲染。
   - 可以通过传递自定义的比较函数来控制比较逻辑。

- 示例代码

```javascript
// PureComponent 示例
class MyPureComponent extends React.PureComponent {
  render() {
    return <div>{this.props.name}</div>;
  }
}

// memo 示例
const MyMemoComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});
```

- `undefined` 的处理

对于`undefined`，浅比较会使用严格相等运算符（`===`）进行比较。因此，如果两个值都是`undefined`，它们会被认为是相等的。例如：

```javascript
const a = undefined;
const b = undefined;

console.log(a === b); // 输出: true
```

因此，在`PureComponent`和`memo`的浅比较中，两个`undefined`值会被认为是相等的，不会触发重新渲染。

- 总结

- `PureComponent` 和 `memo` 使用浅比较来判断属性是否有变化。
- 浅比较使用严格相等运算符（`===`）进行比较。
- 对于`undefined`，如果两个值都是`undefined`，则认为它们是相等的，不会触发重新渲染。


```

import React, { Component, PureComponent, memo } from 'react';
import logo from './logo.svg';
import './App.css';

// 避免组建重新渲染 shouldComponentUpdate pureComponent memo 组件拆分的越简单 使用 pureComponent memo 的机会也就越多

// class Foo extends Component {

//   shouldComponentUpdate(nextProps, nextState) {

//     if (this.props.name === nextProps.name) {
//       return false;
//     }
//     return true;
//   }
//   render() {
//     console.log('Foo');
//     return null;
//   }
// }

// 只有传入的props的第一级发生变化时，才更新
// class Foo extends PureComponent {
//   render() {
//     console.log('Foo');
//     return <div>{this.props.person.age}</div>;
//   }
// }

//无状态组件 不可以使用 this
// function Foo(props) {
//   console.log('Foo');
//   // return <div>{this.props.person.age}</div>;
//   return <div>{props.person.age}</div>;
// }

const Foo = memo(function Foo(props) {
  console.log('Foo');
  return <div>{props.person.age}</div>;
})

class App extends Component {

  state = {
    count: 0,
    person: {
      age: 1,
    }
  }

  // 类属性
  callback = () => {
    
  }

  render() {

    const person = this.state.person;

    return (
      <div className="App">
        <button onClick={() => {
          person.age++;
          this.setState({ count: this.state.count + 1 });
        }}>Add</button>
        {/* <button onClick={() => this.setState({ count: this.state.count + 1 })}>Add</button> */}

        {/* person 本身没变化，但是cb每次都传入新的引用，导致Foo组件重新渲染 */}
        {/* <Foo person={person} cb={() => { }} /> */}

        <Foo person={person} cb={this.callback} />
      </div>
    );
  }
}


export default App;


```


### React Hooks 提供了多种工具来简化函数组件的开发，使你可以更轻松地管理状态、副作用和其他特性。常用 Hooks 包括：


useState：管理状态。
useEffect：处理副作用。
useContext：访问上下文。
useCallback：缓存函数。
useMemo：缓存计算结果。
useRef：创建可变引用。

useReducer：处理复杂状态逻辑。
useImperativeHandle：自定义暴露给父组件的实例值。
useLayoutEffect：同步执行的副作用。
useDebugValue：调试自定义 Hook。


### useCallback

作用：用于缓存函数，避免不必要的重新创建。
使用场景：当传递给子组件的函数在父组件每次渲染时都重新创建时，会导致子组件不必要的重新渲染。useCallback可以缓存这个函数，只有在依赖项发生变化时才重新创建。

```
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

```

### useMemo

作用：用于缓存计算结果，避免不必要的重复计算。
使用场景：当某个复杂的计算结果只依赖于某些特定的值时，可以使用useMemo来缓存这个结果，只有在依赖项发生变化时才重新计算。

```

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

```

### useContext


作用：用于订阅React的Context对象，以便在组件中访问上下文中的值。
使用场景：当需要在多个层级嵌套的组件之间共享状态或数据时，可以使用Context API，而useContext则提供了更简洁的方式来消费这些数据。


```
const value = useContext(MyContext);

```



### useRef


作用：用于创建一个可变的引用对象，其值在组件的整个生命周期内保持不变。
使用场景：
访问DOM元素。
存储不触发重新渲染的数据（如计数器、定时器ID等）。

```

const inputEl = useRef(null);

useEffect(() => {
  // 可以直接访问inputEl.current
  inputEl.current.focus();
}, []);

return <input ref={inputEl} />;

```

总结：
useCallback useMemo useRef useContext这些是React中常用的Hooks，用于优化性能、管理状态和共享上下文。下面分别介绍它们的作用和用法：

### useEffect

useEffect 是 React 中用于处理副作用的 Hook。副作用包括数据获取、订阅、手动修改 DOM、记录日志等操作。useEffect 允许你在函数组件中执行这些操作，类似于类组件中的生命周期方法（如 componentDidMount、componentDidUpdate 和 componentWillUnmount）。




```
import React, { Component, memo, useState, useCallback, useMemo, useRef, useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const MyContext = React.createContext();

const Foo = memo(function Foo(props) {
  console.log('Foo');
  return <div>{props.person.age} {props.count}</div>;
});


function FunctionalApp() {
  const [count, setCount] = useState(0);
  const [person, setPerson] = useState({ age: 1 });

  const callback = useCallback(() => {}, []);

  useEffect(() => {
    console.log(`Count has changed to ${count}`);
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 5000);

    return () => {
      console.log('Clearing interval');
      clearInterval(timer);
    };
  }, []);

  return (
    <MyContext.Provider value={{ count, person, callback }}>
      <div className="App">
        <button onClick={() => {
          setPerson(prevPerson => ({ ...prevPerson, age: prevPerson.age + 1 }));
          setCount(prevCount => prevCount + 1);
        }}>Add</button>

        <Foo person={person} count={count} cb={callback} />
      </div>
    </MyContext.Provider>
  );
}

export default FunctionalApp;

```


### useReducer


useReducer 是 React 提供的一个 Hook，用于管理复杂的状态逻辑。它特别适用于状态逻辑涉及多个子状态或需要处理复杂的更新逻辑的情况。useReducer 的工作原理类似于 Redux 中的 reducer 函数，通过一个 reducer 函数来处理不同的动作（actions），从而更新状态。


```
const [state, dispatch] = useReducer(reducer, initialState);



import React, { useReducer } from 'react';

// 定义初始状态
const initialState = { count: 0 };

// 定义 reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  // 使用 useReducer 钩子
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

export default Counter;

```


复杂状态管理

```

import React, { useReducer } from 'react';

// 定义初始状态
const initialState = {
  count: 0,
  step: 1
};

// 定义 reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return initialState;
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      throw new Error();
  }
}

function Counter() {
  // 使用 useReducer 钩子
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
    </div>
  );
}

export default Counter;
```

### useImperativeHandle

useImperativeHandle 是 React 提供的一个 Hook，用于自定义暴露给父组件的实例值。它允许你在使用 ref 时，控制父组件可以访问的子组件的方法或属性。这对于封装子组件的内部实现细节，只暴露必要的接口非常有用。


useImperativeHandle 接收三个参数：

ref：从父组件传递下来的 ref。
createHandle：一个函数，返回一个对象，该对象包含父组件可以访问的方法或属性。
dependencies：依赖项数组，当依赖项变化时，createHandle 会被重新执行。


下面是一个简单的示例，展示了如何使用 useImperativeHandle 来控制父组件可以访问的子组件的方法。

```

子组件 FancyInput：

    使用 forwardRef 将 ref 传递给子组件。
    使用 useState 管理输入框的值。
    使用 useImperativeHandle 自定义暴露给父组件的方法：
    focus：使输入框获得焦点。
    getValue：获取输入框的当前值。

父组件 ParentComponent：

    使用 useRef 创建一个 ref 对象。
    定义 focusInput 方法，通过 ref 调用子组件的 focus 方法。
    定义 getValue 方法，通过 ref 调用子组件的 getValue 方法。


import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';

// 子组件
const FancyInput = forwardRef((props, ref) => {
  const [value, setValue] = useState('');

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    getValue: () => {
      return value;
    }
  }));

  const inputRef = useRef(null);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type something..."
    />
  );
});

// 父组件
function ParentComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  const getValue = () => {
    const inputValue = inputRef.current.getValue();
    alert(`Input value: ${inputValue}`);
  };

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={getValue}>Get Value</button>
    </div>
  );
}

export default ParentComponent;

```

复杂示例：控制子组件的内部状态


```
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';

// 子组件
const Timer = forwardRef((props, ref) => {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    start: () => {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    },
    stop: () => {
      clearInterval(timerRef.current);
    },
    reset: () => {
      clearInterval(timerRef.current);
      setSeconds(0);
    },
    getSeconds: () => {
      return seconds;
    }
  }));

  return (
    <div>
      <p>Seconds: {seconds}</p>
    </div>
  );
});

// 父组件
function ParentComponent() {
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current.start();
  };

  const stopTimer = () => {
    timerRef.current.stop();
  };

  const resetTimer = () => {
    timerRef.current.reset();
  };

  const getSeconds = () => {
    const currentSeconds = timerRef.current.getSeconds();
    alert(`Current Seconds: ${currentSeconds}`);
  };

  return (
    <div>
      <Timer ref={timerRef} />
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={getSeconds}>Get Seconds</button>
    </div>
  );
}

export default ParentComponent;

```


### useImperativeHandle  对应 vue3中的实现  ref 和 defineExpose


ref：用于在父组件中引用子组件或 DOM 元素。
defineExpose：用于显式地暴露子组件的属性和方法给父组件。

```
子组件 FancyInput.vue

<template>
  <input
    ref="inputRef"
    v-model="value"
    placeholder="Type something..."
  />
</template>

<script>
import { ref, defineExpose } from 'vue';

export default {
  setup() {
    const inputRef = ref(null);
    const value = ref('');

    // 自定义暴露给父组件的方法
    const focus = () => {
      inputRef.value.focus();
    };

    const getValue = () => {
      return value.value;
    };

    // 显式暴露方法给父组件
    defineExpose({
      focus,
      getValue
    });

    return {
      inputRef,
      value
    };
  }
};
</script>

父组件 ParentComponent.vue

<template>
  <div>
    <FancyInput ref="fancyInputRef" />
    <button @click="focusInput">Focus Input</button>
    <button @click="getValue">Get Value</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import FancyInput from './FancyInput.vue';

export default {
  components: {
    FancyInput
  },
  setup() {
    const fancyInputRef = ref(null);

    const focusInput = () => {
      fancyInputRef.value.focus();
    };

    const getValue = () => {
      const inputValue = fancyInputRef.value.getValue();
      alert(`Input value: ${inputValue}`);
    };

    return {
      fancyInputRef,
      focusInput,
      getValue
    };
  }
};
</script>


```

### useLayoutEffect 同步执行的副作用。

与 useEffect 类似，但 useLayoutEffect 会在浏览器绘制之前执行，避免闪烁问题。
由于 useLayoutEffect 会阻塞浏览器绘制，应谨慎使用，避免性能问题。

useLayoutEffect 是 React 提供的一个 Hook，用于在浏览器绘制之前同步执行副作用。它与 useEffect 类似，但有一些关键的区别，特别是在性能和执行时机方面。以下是 useLayoutEffect 的详细解释和使用场景。

示例：使用 useLayoutEffect 读取 DOM 布局

```
import React, { useLayoutEffect, useRef, useState } from 'react';

function LayoutEffectExample() {
  const divRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={divRef} style={{ height: '100px', backgroundColor: 'lightblue' }}>
        This div has a height of {height}px
      </div>
    </div>
  );
}

export default LayoutEffectExample;

```


### useDebugValue：调试自定义 Hook。


useDebugValue 是 React 提供的一个 Hook，用于在 React DevTools 中显示自定义 Hook 的标签。这有助于调试自定义 Hook，使其在 DevTools 中更易于识别和理解。以下是 useDebugValue 的详细解释和使用场景。

示例：格式化显示值
有时，你可能希望在 DevTools 中显示更复杂的值或格式化后的值。可以传递一个格式化函数来实现这一点。

```
import React, { useState, useDebugValue } from 'react';

function useCustomHook(initialValue) {
  const [value, setValue] = useState(initialValue);

  // 使用 useDebugValue 显示格式化后的值
  useDebugValue(value, value => `Count: ${value}`);

  return [value, setValue];
}

function App() {
  const [count, setCount] = useCustomHook(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
```


###  React.lazy 和 Suspense

在 React 中，React.lazy 和 Suspense 是用于代码分割和懒加载的工具。它们可以帮助你按需加载组件，从而提高应用的性能和加载速度。以下是 React.lazy 和 Suspense 的详细解释和使用场景。

在实际应用中，React.lazy 和 Suspense 通常与路由结合使用，实现路由懒加载。


```
// Home.js
import React from 'react';

const Home = () => {
  return <div>This is the Home Component</div>;
};

export default Home;


// About.js
import React from 'react';

const About = () => {
  return <div>This is the About Component</div>;
};

export default About;


// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

```

### React 中的高阶组件

当然！高阶组件（Higher-Order Component, HOC）是 React 中用于复用组件逻辑的一种高级技术。withAuth 是一个常见的 HOC 示例，用于检查用户是否已认证，并根据认证状态决定渲染哪个组件。


```
src/hocs/withAuth.js

import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      // 模拟异步认证检查
      const checkAuth = async () => {
        // 这里可以替换为实际的认证检查逻辑
        const isAuthenticated = localStorage.getItem('authToken');
        setIsAuthenticated(isAuthenticated);
      };

      checkAuth();
    }, []);

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // 加载状态
    }

    if (!isAuthenticated) {
      return <Redirect to="/login" />; // 未认证时重定向到登录页面
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;


src/components/Dashboard.js

import React from 'react';
import withAuth from '../hocs/withAuth';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default withAuth(Dashboard);


src/components/Login.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // 模拟登录逻辑
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('authToken', 'some-auth-token');
      history.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;


src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;


```


### 自定义 Hook (useFetch 处理 ajax 请求)

当然！自定义 Hook 是 React 中一种强大的工具，可以让你在不同的组件之间复用逻辑。useFetch 是一个常见的自定义 Hook，用于处理数据获取（AJAX 请求）。下面是一个详细的 useFetch 自定义 Hook 的示例，包括如何使用它来获取数据。

```

// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, options]);

  return { data, loading, error };
};

export default useFetch;

// src/components/DataFetcher.js
import React from 'react';
import useFetch from '../hooks/useFetch';

const DataFetcher = () => {
  const { data, loading, error } = useFetch('https://api.example.com/data');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Data Fetched</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataFetcher;



// src/components/DataFetcher.js
import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';

const DataFetcher = () => {
  const [data, loading, error] = useFetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key: 'value' }),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Data Fetched</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataFetcher;


// src/App.js
import React from 'react';
import DataFetcher from './components/DataFetcher';

function App() {
  return (
    <div className="App">
      <DataFetcher />
    </div>
  );
}

export default App;




```







### React 中的副作用

在 React 中，**副作用（side effects）**是指那些与组件渲染逻辑无关的操作。这些操作通常会在组件挂载、更新或卸载时执行，并且可能会对应用程序的状态或外部环境产生影响。常见的副作用包括：

1. **数据获取**：从 API 获取数据。
2. **订阅**：订阅事件监听器或其他数据源。
3. **手动修改 DOM**：直接操作 DOM 元素。
4. **记录日志**：将信息输出到控制台。
5. **定时器**：设置和清除定时器。
6. **浏览器存储**：读取或写入 `localStorage` 或 `sessionStorage`。

#### 为什么需要处理副作用？

React 的核心理念是通过声明式编程来描述 UI 的样子，即根据当前的状态和属性来决定组件应该渲染什么内容。然而，某些操作不能简单地通过状态和属性的变化来触发，而是需要在特定的时间点（如组件挂载或更新后）执行。这就是为什么我们需要专门的机制来处理副作用。

#### 如何处理副作用？

在类组件中，副作用通常通过生命周期方法来处理，例如：

- `componentDidMount`：组件挂载后执行。
- `componentDidUpdate`：组件更新后执行。
- `componentWillUnmount`：组件卸载前执行。

而在函数组件中，React 提供了 `useEffect` 钩子来处理副作用。`useEffect` 可以替代类组件中的生命周期方法，并且更加灵活和直观。

#### `useEffect` 的工作原理

`useEffect` 接收两个参数：

1. **effect 函数**：包含要执行的副作用逻辑。
2. **依赖项数组**：指定哪些状态或属性的变化会触发 effect 函数的重新执行。

```javascript
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理逻辑（可选）
  };
}, [dependencies]); // 依赖项数组
```

- 如果依赖项数组为空 `[]`，则 effect 只会在组件挂载和卸载时执行。
- 如果依赖项数组包含某些状态或属性，则 effect 会在这些值变化时执行。
- 如果没有提供依赖项数组，默认情况下 effect 会在每次渲染后执行。

#### 示例：使用 `useEffect` 处理副作用

```javascript
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Count has changed to ${count}`);

    // 设置定时器
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 5000);

    // 清理定时器
    return () => {
      console.log('Clearing interval');
      clearInterval(timer);
    };
  }, [count]); // 依赖项数组

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default MyComponent;
```

在这个例子中：

- `useEffect` 在 `count` 发生变化时执行。
- 它设置了每 5 秒增加一次 `count` 的定时器。
- 当组件卸载或 `count` 再次变化时，清理定时器以避免内存泄漏。

#### 总结

- **副作用** 是指那些与组件渲染逻辑无关的操作，如数据获取、订阅、手动修改 DOM 等。
- 在类组件中，副作用通常通过生命周期方法处理；在函数组件中，使用 `useEffect` 钩子来处理副作用。
- `useEffect` 提供了一种灵活且直观的方式来管理副作用，确保它们在适当的时间点执行并进行清理。


### 什么时候用函数组件什么时候用 class组件


在 React 中，选择使用函数组件还是类组件取决于具体的需求和场景。随着 React Hooks 的引入，函数组件的功能已经非常强大，可以满足大多数场景的需求。以下是选择使用函数组件或类组件的一些指导原则：

- 使用函数组件的情况

1. **简单状态管理**：
   - 当组件的状态逻辑相对简单时，使用函数组件和 `useState` 钩子来管理状态。
   - 示例：
     ```javascript
     import React, { useState } from 'react';

     function Counter() {
       const [count, setCount] = useState(0);

       return (
         <div>
           <p>Count: {count}</p>
           <button onClick={() => setCount(count + 1)}>Increment</button>
         </div>
       );
     }
     ```

2. **不需要生命周期方法**：
   - 如果组件不需要使用生命周期方法（如 `componentDidMount`、`componentDidUpdate` 等），函数组件是一个更好的选择。
   - 使用 `useEffect` 钩子可以处理副作用和生命周期相关的逻辑。

3. **更好的性能**：
   - 函数组件通常比类组件性能更好，因为它们没有实例化对象的开销。

4. **更简洁的代码**：
   - 函数组件的代码通常更简洁，易于阅读和维护。

5. **Hooks 的丰富功能**：
   - 使用 `useReducer`、`useContext`、`useMemo`、`useCallback` 等 Hooks 可以实现复杂的状态管理和优化。

- 使用类组件的情况

1. **复杂的生命周期逻辑**：
   - 如果组件需要复杂的生命周期逻辑，类组件可能更合适。
   - 虽然 `useEffect` 可以处理大部分生命周期逻辑，但在某些复杂场景下，类组件的生命周期方法可能更直观。

2. **需要使用 `this` 关键字**：
   - 如果组件需要使用 `this` 关键字来访问组件实例的方法或属性，类组件是一个更好的选择。
   - 虽然可以通过 `useRef` 来实现类似的功能，但类组件的 `this` 更加直观。

3. **代码迁移**：
   - 如果项目中已经存在大量的类组件，为了保持一致性，可能需要继续使用类组件。
   - 逐步将类组件迁移到函数组件也是一个可行的策略。

4. **团队习惯**：
   - 如果团队更熟悉类组件的编写方式，可能需要继续使用类组件。
   - 逐步引入 Hooks 并迁移到函数组件可以减少团队的学习成本。

- 示例对比

- 函数组件示例

```javascript
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

- 类组件示例

```javascript
import React, { Component } from 'react';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({ seconds: prevState.seconds + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div>Seconds: {this.state.seconds}</div>;
  }
}
```

- 总结

- **函数组件**：
  - 适用于大多数场景。
  - 代码更简洁，易于维护。
  - 支持 Hooks，功能强大。

- **类组件**：
  - 适用于复杂的生命周期逻辑。
  - 适用于需要使用 `this` 关键字的场景。
  - 适用于代码迁移和团队习惯。

随着 React Hooks 的不断成熟和优化，函数组件已经成为 React 开发中的主流选择。但在某些特定场景下，类组件仍然有其适用性。根据具体需求和团队习惯来选择合适的组件类型。


### react 中ajax 放在那个生命周期里面处理更合适


在类组件中，通常使用 componentDidMount 生命周期方法来处理 AJAX 请求。这是因为 componentDidMount 在组件挂载到 DOM 后立即调用，是进行数据获取的理想时机。

```

import React, { Component } from 'react';

class DataFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => this.setState({ data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <div>
        <h1>Data Fetched</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
}

export default DataFetcher;

```

函数组件
在函数组件中，使用 useEffect Hook 来处理 AJAX 请求。useEffect 可以替代类组件中的生命周期方法，并且更加灵活。

```

import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Data Fetched</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;
```


如果需要在组件卸载时取消 AJAX 请求（例如，使用 AbortController），可以在 useEffect 中返回一个清理函数。


```

useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch('https://api.example.com/data', { signal })
    .then(response => response.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        return;
      }
      setError(error);
      setLoading(false);
    });

  return () => {
    controller.abort();
  };
}, []);

```

### vue 中ajax 放在那个生命周期里面处理更合适

在 Vue 2 中，通常使用 created 或 mounted 生命周期钩子来处理 AJAX 请求。

在 Vue 3 中，推荐使用组合式 API (setup 函数) 来处理 AJAX 请求。setup 函数在组件创建之前执行，类似于 Vue 2 的 beforeCreate 钩子，但更推荐在 setup 中进行数据获取。

```
// Vue 2
export default {
  data() {
    return {
      data: null,
      loading: true,
      error: null,
      controller: null
    };
  },
  created() {
    this.controller = new AbortController();
    const signal = this.controller.signal;

    fetch('https://api.example.com/data', { signal })
      .then(response => response.json())
      .then(data => {
        this.data = data;
        this.loading = false;
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          return;
        }
        this.error = error;
        this.loading = false;
      });
  },
  beforeDestroy() {
    this.controller.abort();
  }
};

// Vue 3
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <h1>Data Fetched</h1>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    // 提前发出 AJAX 请求
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        data.value = data;
        loading.value = false;
      })
      .catch(error => {
        error.value = error;
        loading.value = false;
      });

    // 可选：在组件挂载后执行其他操作
    onMounted(() => {
      console.log('Component has been mounted');
    });

    return {
      data,
      loading,
      error
    };
  }
};
</script>

```


### react 中 如何拆分组件更合适

在 React 中，合理地拆分组件可以提高代码的可维护性、可重用性和可读性。以下是一些关于如何拆分组件的最佳实践和指导原则：


1. 单一职责原则 (Single Responsibility Principle)
2. 组件的粒度 
3. 可重用性
4. 逻辑分离

ProductList 组件：负责显示产品列表。
ProductItem 组件：负责显示单个产品项。
ProductFilter 组件：负责产品过滤逻辑。

5. 容器组件与展示组件

将容器组件（负责数据获取和状态管理）与展示组件（负责渲染UI）分离。

UserContainer 组件：负责获取用户数据并传递给 UserProfile 组件。
UserProfile 组件：负责渲染用户信息。

6. 组合组件

7. 命名规范
为组件选择有意义的名称，以便清晰地表达其功能。

示例：
LoginForm：表示登录表单组件。
ProductGallery：表示产品画廊组件。
NotificationBar：表示通知栏组件。

8. 避免深层嵌套
尽量避免组件嵌套过深，过深的嵌套会使代码难以理解和维护。

9. 使用高阶组件 (HOC) 或自定义 Hooks
对于可复用的逻辑，可以使用高阶组件或自定义 Hooks。

withAuth HOC：用于处理认证逻辑。
useFetch 自定义 Hook：用于处理数据获取逻辑。

10. 遵循文件结构
保持一致的文件结构，便于查找和管理组件。


### react 移动端ui 组件库有哪些

https://ant-design-mobile.antgroup.com/zh/components/button#button