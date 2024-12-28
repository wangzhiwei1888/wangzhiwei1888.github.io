---
title: 项目中的组件如何打包成独立运行的js
date: 2024-12-28 09:30:46
tags:
---

要将项目中的组件打包成独立运行的 JavaScript 文件，可以使用 Webpack 或 Vite 等构建工具。以下是使用这两种工具的详细步骤：

### 使用 Webpack 打包组件

1. **安装 Webpack 和相关依赖**

   首先，确保你已经安装了 Node.js 和 npm。然后在项目目录中安装 Webpack 和 Webpack CLI：

   ```bash
   npm install --save-dev webpack webpack-cli
   ```

2. **创建 Webpack 配置文件**

   在项目根目录下创建一个 `webpack.config.js` 文件，并配置 Webpack 以打包你的组件：

   ```javascript
   const path = require('path')

   module.exports = {
     entry: './src/index.js', // 你的组件入口文件
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js',
       library: 'MyComponent', // 可选：如果你希望组件可以通过全局变量访问
       libraryTarget: 'umd', // 可选：支持多种模块系统
     },
     module: {
       rules: [
         {
           test: /\.js$/,
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader',
             options: {
               presets: ['@babel/preset-env', '@babel/preset-react'], // 根据需要添加
             },
           },
         },
       ],
     },
   }
   ```

3. **安装 Babel 和相关预设**

   如果你需要支持 ES6+ 语法或 React，安装 Babel 及其相关预设：

   ```bash
   npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react
   ```

4. **编写组件代码**

   确保你的组件代码在 `src/index.js` 中，或者根据 `entry` 配置调整入口文件路径。

5. **运行 Webpack 打包**

   在 `package.json` 中添加一个脚本来运行 Webpack：

   ```json
   "scripts": {
     "build": "webpack"
   }
   ```

   然后运行打包命令：

   ```bash
   npm run build
   ```

   打包完成后，你会在 `dist` 目录下看到 `bundle.js` 文件。

### 使用 Vite 打包组件

1. **安装 Vite**

   首先，确保你已经安装了 Node.js 和 npm。然后在项目目录中安装 Vite：

   ```bash
   npm init vite@latest
   ```

   按照提示选择合适的模板（例如，选择 `vanilla` 或 `react`）。

2. **配置 Vite**

   Vite 默认配置已经支持打包为独立的 JavaScript 文件。你可以在 `vite.config.js` 中进行一些自定义配置：

   ```javascript
   import { defineConfig } from 'vite'

   export default defineConfig({
     build: {
       lib: {
         entry: 'src/index.js', // 你的组件入口文件
         name: 'MyComponent', // 可选：如果你希望组件可以通过全局变量访问
         fileName: format => `my-component.${format}.js`,
       },
       rollupOptions: {
         external: ['vue', 'react'], // 根据需要排除的依赖
         output: {
           globals: {
             vue: 'Vue',
             react: 'React',
           },
         },
       },
     },
   })
   ```

3. **编写组件代码**

   确保你的组件代码在 `src/index.js` 中，或者根据 `entry` 配置调整入口文件路径。

4. **运行 Vite 打包**

   在 `package.json` 中添加一个脚本来运行 Vite 打包：

   ```json
   "scripts": {
     "build": "vite build"
   }
   ```

   然后运行打包命令：

   ```bash
   npm run build
   ```

   打包完成后，你会在 `dist` 目录下看到生成的 JavaScript 文件。

### 示例代码

#### Webpack 示例

**webpack.config.js**

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'MyComponent',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
}
```

**src/index.js**

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const MyComponent = () => <div>Hello from React!</div>

export default MyComponent
```

**package.json**

```json
{
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^4.0.0",
    "babel-loader": "^8.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "@babel/preset-react": "^7.0.0"
  }
}
```

#### Vite 示例

**vite.config.js**

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'MyComponent',
      fileName: format => `my-component.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
})
```

**src/index.js**

```javascript
import React from 'react'

const MyComponent = () => <div>Hello from React!</div>

export default MyComponent
```

**package.json**

```json
{
  "scripts": {
    "build": "vite build"
  },
  "devDependencies": {
    "vite": "^2.0.0"
  }
}
```

通过以上步骤，你可以将项目中的组件打包成独立运行的 JavaScript 文件，并在其他项目中使用。

libraryTarget: 'umd', // 可选：支持多种模块系统 umd 是什么意思，除了 umd 还有哪些类型

`libraryTarget: 'umd'` 是 Webpack 配置中的一个选项，用于指定打包后的库如何暴露。UMD（Universal Module Definition）是一种模块格式，它使得你的库可以在多种环境中使用，包括 CommonJS、AMD（Asynchronous Module Definition）和全局变量。

### UMD 的含义

UMD 是一种模块封装格式，旨在让模块在不同的环境中都能正常工作。具体来说，UMD 模块可以被 CommonJS 模块加载器（如 Node.js）、AMD 模块加载器（如 RequireJS）以及浏览器全局变量中使用。

### 其他常见的 `libraryTarget` 类型

除了 `umd`，Webpack 还支持其他几种 `libraryTarget` 类型，每种类型适用于不同的环境：

1. **`var`**

   - **描述**: 默认值。将库暴露为一个全局变量。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于浏览器环境，通过 `<script>` 标签引入。

2. **`this`**

   - **描述**: 将库暴露为 `this` 对象的一个属性。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于浏览器环境，通常在模块化环境中使用。

3. **`window`**

   - **描述**: 将库暴露为 `window` 对象的一个属性。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于浏览器环境，通过 `<script>` 标签引入。

4. **`global`**

   - **描述**: 将库暴露为 `global` 对象的一个属性。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于 Node.js 环境。

5. **`commonjs`**

   - **描述**: 将库暴露为 CommonJS 模块。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于 Node.js 环境。

6. **`commonjs2`**

   - **描述**: 将库暴露为 CommonJS2 模块。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于 Node.js 环境，与 `commonjs` 类似，但使用 `module.exports` 而不是 `exports`。

7. **`amd`**

   - **描述**: 将库暴露为 AMD 模块。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于使用 RequireJS 等 AMD 加载器的浏览器环境。

8. **`amd-require`**
   - **描述**: 将库暴露为 AMD 模块，但使用 `require` 语法。
   - **示例**: `libraryTarget: 'MyLibrary'`
   - **使用场景**: 适用于使用 RequireJS 等 AMD 加载器的浏览器环境。

### 示例

假设你有一个简单的库，希望它可以在多种环境中使用，你可以这样配置 Webpack：

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-library.js',
    library: 'MyLibrary',
    libraryTarget: 'umd', // 支持多种模块系统
  },
}
```

通过设置 `libraryTarget: 'umd'`，你的库可以在浏览器中通过全局变量访问，也可以在 Node.js 中通过 `require` 引入，还可以在使用 AMD 加载器的环境中通过 `define` 引入。

### 总结

- **UMD**: 支持 CommonJS、AMD 和全局变量，适用于多种环境。
- **var**: 默认值，暴露为全局变量。
- **this**: 暴露为 `this` 对象的一个属性。
- **window**: 暴露为 `window` 对象的一个属性。
- **global**: 暴露为 `global` 对象的一个属性。
- **commonjs**: 暴露为 CommonJS 模块。
- **commonjs2**: 暴露为 CommonJS2 模块。
- **amd**: 暴露为 AMD 模块。
- **amd-require**: 暴露为 AMD 模块，使用 `require` 语法。

选择合适的 `libraryTarget` 可以确保你的库在目标环境中能够正常工作。
