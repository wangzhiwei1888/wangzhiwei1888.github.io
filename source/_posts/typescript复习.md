---
title: typescript复习
date: 2024-12-23 17:34:43
tags:
  - typescript
categories:
  - typescript
---





## 安装


```
cnpm i typescript
cnpm i @types/node

npx tsc --init

生成  tsconfig.json


npx tsc 
npx tsc --watch 
```

```
nodejs 环境的tsconfig.json 配置
{
  "compilerOptions": {
    
    "target": "es2016", //目标代码
    "lib": ["es2016"], //开发时的库
    // "module":"ES2015", //模块规范
    "module":"CommonJS", //设置编译结果中使用的模块化标准
    "outDir": "dist", //输出目录
    "strictNullChecks": true, //严格空检查
    "removeComments": true, //编译结果移除注释
    "esModuleInterop": true, //兼启用es模块化交互非es模块导出
    "noEmitOnError": true, // 编译错误不输出编译结果
    // "moduleResolution": "node" //设置解析模块的模式
  },
  "include": ["src/**/*"],  //指定编译文件
  // "files": ["src/index.ts"] //指定编译文件,
  
}



```

## 泛型

```
// 泛型 在函数中使用

function take2<T = number>(arr: T[], n: number): T[]
{

    if (n > arr.length) {
        return arr;
    }
    const newArr:T[] = [];

    for (let i = 0; i < n; i++) {
        newArr.push(arr[i]);
    }

    return newArr;

}

take2<number>([1,2], 3);

take2<string>(['1','2'], 3);




```

函数的泛型应用

```
function combin<T extends number | string>(a: T, b: T): T{
    return (a as any) + (b as any) as T;
}

const res = combin(1,2);


const res1 = combin('a','b');

// const res2 = combin(3,'b'); // 报错

```




```
函数中的泛型应用

type callBack<T> = (n: T, i: number) => boolean;


function filter<T>(arr: T[], callback: callBack<T>): T[]
{
    const newArr: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i)) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

const arr = [1, 2, 3, 4, 5];

console.log(filter(arr, (n) => n > 2));

```

```

构造函数中的泛型应用

class ArrayHelper<T> {

    constructor(private arr: T[])
    {

    }

    take(n: number): T[]
    {
        if (n > this.arr.length) {
            return this.arr;
        }
        const newArr:T[] = [];
        for (let i = 0; i < n; i++) {
            newArr.push(this.arr[i]);
        }
        return newArr;
    }
    filter(callback: callBack<T>): T[]
    {
        const newArr: T[] = [];
        for (let i = 0; i < this.arr.length; i++) {
            if (callback(this.arr[i], i)) {
                newArr.push(this.arr[i]);
            }
        }
        return newArr;
   }

   shuffle() {

    for (let i = this.arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
    }

   }


}



const helper = new ArrayHelper(arr);

const newA = helper.filter(n => n > 2);

console.log(newA);

helper.shuffle();

console.log(helper.take(3));
```

泛型约束

```

interface hasNameProperty {
    name: string;
}

function nameToUpperCase <T extends hasNameProperty> (obj: T): T
{

    obj.name = obj.name.split(" ")
        .map(n => n[0].toUpperCase() + n.slice(1))
        .join(" ");

    return obj;
}

const o = {
    name: "john wang",
    age: 30
}

const newO = nameToUpperCase(o);

console.log(newO.name);

```


## 导入三方模块

```
// 导入文件系统模块 在 ts 中异常
// import fs from 'fs';

//需要改写为 
import {readFileSync} from 'fs';

//或改写为
//import * as fs from "fs";


const input = readFileSync('./input.txt', 'utf-8').split('\n');



编译后代码

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const input = (0, fs_1.readFileSync)('./input.txt', 'utf-8').split('\n');


```

```

//或改写为
import * as fs from "fs";


const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

编译后代码

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');


```



非要用 import fs from 'fs'; 要改写 配置文件

增加
"esModuleInterop": true, //兼容es6模块

```

import fs from 'fs';
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

编译后代码

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const input = fs_1.default.readFileSync('./input.txt', 'utf-8').split('\n');





```


## TS中书写 commjs 模块代码

导出 export = xxxx

导入 import xxx = require('xxx');


```
c.ts
export = {
    add: (a:number,b:number)=>a+b,
    name: 'c'
}


05.ts

import aa = require('./c');

console.log(aa.name)


编译后代码

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aa = require("./c");
console.log(aa.name);


"use strict";
module.exports = {
    add: (a, b) => a + b,
    name: 'c'
};


```




## 枚举

```

enum Gend {
    Male = 'male',
    Female = 'female'
}

let gen: Gend;

gen = Gend.Male;
gen = Gend.Female;

会参与编译 枚举属性的值是字符串或数字，为数字时会自增，可以赋值（不建议）


```


## 接口和别名


```
type Gender = 'male' | 'female';
let gender: Gender;
gender = 'male';
gender = 'female';

function showGender(gender: Gender): void
{
    console.log(gender);
}

```

``` 


//接口
interface Person {
    name: string;
    age: number;
    sayHello(): void;
}

// 类型别名
type Person2 = {
    name: string;
    age: number;
};



let p1: Person = {
    name: 'zhangsan',
    age: 18,
    sayHello(){
        console.log('hello');
    }
};


let p2: Person2 = {
    name: 'zhangsan',
    age: 18
};



type Condition = (n: number) => boolean;

function sum(number: number[], callback: Condition) {

    let s = 0;

    number.forEach(n => {
        if (callback(n)) {
            s += n;
        }
    });
}

const result =  sum([1,2,3,4,5], n => n % 2 === 0);

console.log(result);



```


## 接口（Interface）和类型别名（Type Alias）的区别

在 TypeScript 中，接口和类型别名都可以用来定义对象的形状，但它们有一些关键的区别。以下是它们的主要差异：

### 1. 扩展性（Extensibility）

- **接口**：可以使用 `extends` 关键字来扩展其他接口。
  ```typescript
  interface Person {
      name: string;
      age: number;
  }

  interface Employee extends Person {
      employeeId: number;
  }
  ```

- **类型别名**：不能直接扩展其他类型别名，但可以通过交叉类型（intersection types）实现类似的效果。
  ```typescript
  type Person = {
      name: string;
      age: number;
  };

  type Employee = Person & {
      employeeId: number;
  };
  ```

### 2. 合并（Merging）

- **接口**：支持声明合并（declaration merging），即多个同名接口会自动合并为一个接口。
  ```typescript
  interface Person {
      name: string;
  }

  interface Person {
      age: number;
  }

  // 等价于
  interface Person {
      name: string;
      age: number;
  }
  ```

- **类型别名**：不支持声明合并，多个同名类型别名会导致编译错误。

### 3. 使用场景

- **接口**：主要用于定义对象的形状，通常用于描述类、函数参数或返回值等。
  ```typescript
  interface User {
      id: number;
      name: string;
  }

  class Admin implements User {
      id: number;
      name: string;
      role: string;
  }
  ```

- **类型别名**：更加灵活，可以用于定义原始类型、联合类型、元组等复杂类型。
  ```typescript
  type ID = number | string;

  type Point = [number, number];

  type PartialPerson = {
      name?: string;
      age?: number;
  };
  ```

### 4. 可重载（Overloading）

- **接口**：可以用于函数重载。
  ```typescript
  interface Func {
      (a: number): number;
      (a: string): string;
  }
  ```

- **类型别名**：不能直接用于函数重载，但可以通过函数类型定义实现类似效果。
  ```typescript
  type Func = {
      (a: number): number;
      (a: string): string;
  };
  ```

### 5. 性能

- **接口**：编译后会被优化掉，不会生成额外的 JavaScript 代码。
- **类型别名**：同样不会生成额外的 JavaScript 代码，但在某些情况下可能会有细微的性能差异。

### 总结

- 如果你需要定义对象的形状并且希望支持扩展和合并，建议使用接口。
- 如果你需要定义更复杂的类型（如联合类型、元组等），或者需要更高的灵活性，建议使用类型别名。

在你的代码中，`Person` 和 `Person2` 分别使用了接口和类型别名来定义相同的内容。你可以根据上述区别选择更适合你需求的方式。


## 可重载


在 TypeScript 中，函数重载（Function Overloading） 是指定义多个具有相同名称但参数列表不同的函数签名。编译器会根据调用时传递的参数类型和数量来选择最匹配的函数签名。函数重载允许你为同一个函数提供多种调用方式，从而提高代码的灵活性和可读性。


示例：

typescript

```
// 定义两个重载签名
function add(a: number, b: number): number;
function add(a: string, b: string): string;

// 实现函数
function add(a: any, b: any): any {
    return a + b;
}

// 调用
console.log(add(1, 2));      // 输出: 3
console.log(add("hello", " world"));  // 输出: hello world

```

## 访问修饰符

```

class User {
    
    readonly id:number
    name:string
    age:number
    pid?:string

    // ts语法 访问修饰符
    private publishNumber:number = 3
    private curNumber:number = 0

    constructor(name:string,age:number){
        this.id = Math.random();
        this.name = name;
        this.age = age;
    }

    publish(){
        if (this.curNumber >= this.publishNumber) {
            console.log(`${this.name} 已经发布文章上限`);
            return;
        }
        this.curNumber++;
        console.log(`${this.name} 发布了第${this.curNumber}篇文章`);
    }
}

const u = new User('张三',18);
u.pid = '1111';
// u.id = 2;
console.log(u.id);
console.log(u.pid);


u.publish();
u.publish();
u.publish();
u.publish();


编译后代码
==>>

class User {
    constructor(name, age) {
        this.publishNumber = 3;
        this.curNumber = 0;
        this.id = Math.random();
        this.name = name;
        this.age = age;
    }
    publish() {
        if (this.curNumber >= this.publishNumber) {
            console.log(`${this.name} 已经发布文章上限`);
            return;
        }
        this.curNumber++;
        console.log(`${this.name} 发布了第${this.curNumber}篇文章`);
    }
}
const u = new User('张三', 18);
u.pid = '1111';
console.log(u.id);
console.log(u.pid);
u.publish();
u.publish();
u.publish();
u.publish();


```


## React + TS


```




```


## JSX 和 TSX 的区别

在 React 开发中，JSX 和 TSX 是两种不同的文件扩展名，它们用于定义组件的模板语法。以下是它们的主要区别：

### 1. 文件扩展名
- **JSX**: 文件扩展名为 `.jsx`，主要用于编写 React 组件，但不包含 TypeScript 类型检查。
- **TSX**: 文件扩展名为 `.tsx`，不仅支持 JSX 语法，还集成了 TypeScript 的类型检查功能。

### 2. 类型检查
- **JSX**: 没有内置的类型检查功能，因此无法在编译时捕获类型错误。
- **TSX**: 支持 TypeScript 的类型检查，可以在编译时检测并报告类型错误，提高代码的健壮性和可维护性。

### 3. 语法兼容性
- **JSX**: 只能使用 JavaScript 语法。
- **TSX**: 可以使用 TypeScript 语法，包括类型注解、接口、泛型等。

### 4. 示例代码

### JSX 示例
```jsx
// MyComponent.jsx
import React from 'react';

function MyComponent(props) {
    return (
        <div>
            <h1>Hello, {props.name}</h1>
        </div>
    );
}

export default MyComponent;
```

### TSX 示例
```tsx
// MyComponent.tsx
import React from 'react';

interface MyComponentProps {
    name: string;
}

/**
 * 
 * React.FC<MyComponentProps> 是 TypeScript 中用于定义 React 函数组件的一种类型。
    React.FC 是 React.FunctionComponent 的缩写，它是一个泛型，可以接受一个对象作为参数，这个对象描述了组件的属性类型。
    MyComponentProps 是你自定义的一个接口或类型，用来定义组件接收的 props 类型。
    使用 React.FC<MyComponentProps> 有以下好处：

    明确指定了组件的 props 类型，增强了代码的可读性和可维护性。
    提供了更好的编辑器支持，如自动补全和类型检查。

 ** /

 // 推荐使用
const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
    return (
        <div>
            <h1>Hello, {name}</h1>
        </div>
    );
};

export default MyComponent;


或者

export function MyComponent(props: MyComponentProps) {
    return (
        <div>
            <h1>Hello, {props.name}</h1>
        </div>
    )
}


```

### 5. 编译和工具支持
- **JSX**: 使用 Babel 等工具进行编译，通常与 Webpack 或其他模块打包工具结合使用。
- **TSX**: 使用 TypeScript 编译器（tsc）进行编译，同时可以与 Babel 结合使用以支持更广泛的浏览器兼容性。

### 6. 性能
- **JSX** 和 **TSX** 在运行时性能上没有显著差异，因为最终都会被编译为普通的 JavaScript 代码。但是，TSX 提供了更好的开发时体验，减少了潜在的类型错误。

### 总结
- 如果你希望在 React 项目中使用 TypeScript 进行类型检查和增强的开发体验，建议使用 `.tsx` 文件。
- 如果你只需要简单的 JSX 语法且不需要 TypeScript 的类型检查，可以选择 `.jsx` 文件。

在现代 React 开发中，推荐使用 `.tsx` 文件，因为它提供了更好的类型安全性和开发体验。


## tsx 中 extends React.Component 使用举例


在 TypeScript 中，如果你使用 `tsx` 文件并希望定义一个继承自 `React.Component` 的类组件，你可以按照以下步骤进行。假设你已经安装了 `react` 和 `react-dom`，并且已经正确配置了 `tsconfig.json` 以支持 JSX。

以下是一个简单的例子：

1. 首先，确保你已经安装了 `@types/react` 和 `@types/react-dom`，以便 TypeScript 能够识别 React 类型。

   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

2. 创建一个 `.tsx` 文件，例如 `MyComponent.tsx`，并在其中定义一个继承自 `React.Component` 的类组件。

   ```tsx
   import React from 'react';

   interface MyComponentProps {
     name: string;
   }

   interface MyComponentState {
     count: number;
   }

   class MyComponent extends React.Component<MyComponentProps, MyComponentState> {
     constructor(props: MyComponentProps) {
       super(props);
       this.state = {
         count: 0,
       };
     }

     incrementCount = () => {
       this.setState((prevState) => ({
         count: prevState.count + 1,
       }));
     };

     render() {
       return (
         <div>
           <h1>Hello, {this.props.name}!</h1>
           <p>You clicked {this.state.count} times</p>
           <button onClick={this.incrementCount}>Click me</button>
         </div>
       );
     }
   }

   export default MyComponent;
   ```

在这个例子中：

- `MyComponentProps` 定义了组件的 props 类型。
- `MyComponentState` 定义了组件的状态类型。
- `MyComponent` 类继承自 `React.Component`，并指定了 props 和 state 的类型。
- `incrementCount` 方法用于更新组件的状态。
- `render` 方法返回组件的 JSX 结构。

确保你的 `tsconfig.json` 文件配置正确，以便支持 JSX 语法。你可以在 `compilerOptions` 中添加 `"jsx": "react"` 来明确指定 JSX 的处理方式。

```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["es2016", "dom"],
    "module": "CommonJS",
    "outDir": "dist",
    "strictNullChecks": true,
    "removeComments": true,
    "esModuleInterop": true,
    "noEmitOnError": true,
    "jsx": "react"
  },
  "include": ["src/**/*"]
}
```

这样配置后，TypeScript 就能够正确处理 `.tsx` 文件中的 JSX 语法。