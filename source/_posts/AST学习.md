---
title: AST学习
date: 2024-12-24 11:40:26
tags:
  - AST
categories:
  - AST
---

## AST

在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），是源代码语法结构的⼀种抽象表示。
它以树状的形式表现编程语⾔的语法结构，树上的每个节点都表示源代码中的⼀种结构。
AST 运⽤⼴泛，⽐如：
⾼级语⾔的编译、机器码的⽣成
⼀些⾼级编辑器的错误提示、代码⾼亮、代码⾃动补全；
对于前端来说很多⼯具，例如 elint 、 pretiier 对代码错误或⻛格的检查，babel、typescript
对代码的编译处理等等。
AST 转化流程
我们可以实现⼀个⾮常简单的词法分析⼯具，来感受⼀下词法分析的魅⼒，以及这中间我们需要处理的
内容。
在例⼦中我们可以发现，我们通过读取字符串中每个元素，依次记录⾥⾯出现的内容，最终基于内容⽣
成配置，然后再基于配置创建新的代码的结构。
整个解析过程主要分为以下两个步骤：
分词：将整个代码字符串分割成最⼩语法单元数组
语法分析：在分词基础上建⽴分析语法单元之间的关系
词法分析器⾥，每个关键字是⼀个 Token ，每个标识符是⼀个 Token，每个操作符是⼀个 Token，每
个标点符号也都是⼀个 Token。除此之外，还会过滤掉源程序中的注释和空⽩字符（换⾏符、空格、制
表符等。
我们可以通过 ast-explore 来查看代码⽚段转化的结果：
我们可以看到，对于左侧的代码结构，通过解析字符及对应的格式，然后序列化成为⼀个对象的格式，
我们可以通过这个对象，来描述整体的代码的内容。
如果我们希望将 let 转化为 var，那后续我们只需要在基于配置渲染⽬标时，将 let 转化为 var ⽣成即
可。对于 AST 的类型来说，解析的过程中有这么多的类型，针对不同的语句，最终会以下⾯的类型进⾏转
化：


## 模拟 AST 过程


index.js

```

// before: (add 20 (subtract 4 2))
// after: add(2, subtract(4, 2))

// 分词，处理每个字符内容
function generateToken(str) {
  let current = 0;
  let tokens = [];
  while(current < str.length) {
    let char = str[current];

    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "("
      });
      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")"
      });
      current++;
      continue;
    }

    if (/\s/.test(char)) {
      current++;
      continue;
    }

    if (/[0-9]/.test(char)) {
      let numberValue = '';
      while(/[0-9]/.test(char)) {
        numberValue += char;
        char = str[++current];
      }
      tokens.push({
        type: 'number',
        value: numberValue
      });
      continue;
    }

    if (/[a-z]/.test(char)) {
      let stringValue = '';
      while(/[a-z]/.test(char)) {
        stringValue += char;
        char = str[++current];
      }
      tokens.push({
        type: 'name',
        value: stringValue
      });
      continue;
    }

    throw new TypeError("未能识别的字符");
  }

  return tokens;
}

// AST 生成
function generateAST(tokens) {
  let current = 0;

  let ast = {
    type: "Program",
    body: [],
  };

  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: "NumberLiteral",
        value: token.value,
      }
    }
    if (token.type === 'paren' && token.value === "(") {
      token = tokens[++current];
      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      token = tokens[++current];

      while(
        (token.type !== "paren") || (token.type === 'paren' && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }

    throw new TypeError(token.type);
  }

  while(current < tokens.length) {
    ast.body.push(walk())
  }
  return ast;
}

// AST 转化： babel 插件需要我们处理的部分
function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  DFS(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value
        });
      }
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name
          },
          arguments: [],
        };

        node._context = expression.arguments;
        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          }
        }
        parent._context.push(expression);
      }
    }
  })

  return newAst;
}

// AST 遍历
function DFS(ast, visitor) {

  function traverseArray(children, parent) {
    children.forEach(child => traverseNode(child, parent));
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    switch(node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
        break;
    }
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  return traverseNode(ast, null);
}

// ast -> code 生成代码过程
function generate(ast) {
  switch(ast.type) {
    case "Program": return ast.body.map(subAst => generate(subAst)).join('\n');
    case "ExpressionStatement": return generate(ast.expression) + ";";
    case "CallExpression": return generate(ast.callee) + "(" +ast.arguments.map(arg => generate(arg)).join(', ') + ")";
    case "Identifier": return ast.name;
    case "NumberLiteral": return ast.value;
  }
}

function parser(input) {
  const tokens = generateToken(input);
  console.log(tokens);
  const ast = generateAST(tokens);
  console.log(JSON.stringify(ast, null, 2));
  const newAst = transformer(ast);
  console.log(JSON.stringify(newAst, null, 2));
  const code = generate(newAst);
  return code;
}

module.exports = parser;

```

test.js

```

const parser = require('./index.js');

const input = "(add 2 (subtract 4 2))"
const output = "add(2,subtract(4,2));"

console.log("input", input);
console.log("output", parser(input));

```



## Babel


```

ThisExpression | Identifier | Literal |
ArrayExpression | ObjectExpression | FunctionExpression |
ArrowFunctionExpression | ClassExpression |
TaggedTemplateExpression | MemberExpression | Super | MetaProperty |
NewExpression | CallExpression | UpdateExpression | AwaitExpression |
UnaryExpression |
BinaryExpression | LogicalExpression | ConditionalExpression |
YieldExpression | AssignmentExpression | SequenceExpression;

```


针对不同的⼯具，最终也有不同的效果：
@babel/parser : 转化为 AST 抽象语法树；
@babel/traverse 对 AST 节点进⾏递归遍历；
@babel/types 对具体的 AST 节点进⾏进⾏修改；
@babel/generator : AST 抽象语法树⽣成为新的代码；



Babel 的处理步骤

Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），⽣成（generate）。.

词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流。.


你可以把令牌看作是⼀个扁平的语法⽚段数组：

```
n * n;
[
{ type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
{ type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
{ type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
...
]

```

每⼀个 type 有⼀组属性来描述该令牌：
```

{
    type: {
        label: 'name',
        keyword: undefined,
        beforeExpr: false,
        startsExpr: true,
        rightAssociative: false,
        isLoop: false,isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: null
    },
    ...
}

```

和 AST 节点⼀样它们也有 start ， end ， loc 属性。

对于⼀个 babel 插件来说，我们先从先从⼀个接收了当前 babel 对象作为参数的 function 开始。

```
export default function(babel) {
// plugin contents
}

```


由于你将会经常这样使⽤，所以直接取出 babel.types 会更⽅便：（译注：这是 ES2015 语法中的对
象解构，即 Destructuring）

```
export default function({ types: t }) {
// plugin contents
}

```

接着返回⼀个对象，其 visitor 属性是这个插件的主要访问者。

```
export default function({ types: t }) {
    return {
        visitor: {
        // visitor contents
        }
    };
};
```
Visitor 中的每个函数接收2个参数： path 和 state

```
export default function({ types: t }) {
    return {
        visitor: {
            Identifier(path, state) {},
            ASTNodeTypeHere(path, state) {}
        }
    };
};

```

让我们快速编写⼀个可⽤的插件来展示⼀下它是如何⼯作的。下⾯是我们的源代码：

```
foo === bar;
```

其 AST 形式如下：

```
{
    type: "BinaryExpression",
    operator: "===",
    left: {
        type: "Identifier",
        name: "foo"
    },
    right: {
        type: "Identifier",
        name: "bar"
    }
}

```


我们从添加 BinaryExpression 访问者⽅法开始：

```
export default function({ types: t }) {
    return {
        visitor: {
            BinaryExpression(path) {
                // ...
            }
        }
    };
}
```

然后我们更确切⼀些，只关注哪些使⽤了 === 的 BinaryExpression 。

```
visitor: {
    BinaryExpression(path) {
    if (path.node.operator !== "===") {
        return;
    }
    // ...
    }
}

```

现在我们⽤新的标识符来替换 left 属性：

```
BinaryExpression(path) {
    if (path.node.operator !== "===") {
        return;
    }
    path.node.left = t.identifier("sebmck");
    // ...
}
```

于是如果我们运⾏这个插件我们会得到：

```
sebmck === bar;
```

现在只需要替换 right 属性了。

```
BinaryExpression(path) {
    if (path.node.operator !== "===") {
        return;
    }
    path.node.left = t.identifier("sebmck");
    path.node.right = t.identifier("dork");
}

```
这就是我们的最终结果了：

```
sebmck === dork;
```



我们可以⽤更复杂的⼀些配置来完善我们的插件。。



## Babel 插件开发


```

.
├── index.js
├── node_modules
├── output.js
├── package.json
├── plugin.js


package.json

{
  "name": "babel",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.11.1",
    "@babel/types": "^7.11.0",
    "babel-cli": "^6.26.0"
  }
}


.babelrc 

{
  "plugins": [
    ["./plugin", {
      "tips": "newTips"
    }]
  ]
}



plugin.js

module.exports = function({types: t}) {
  return {
    visitor: {
      Identifier(path, state) {
        const name = path.node.name;
        console.log(state.opts);

        // path.node.name = `__${name}`;
        if (state.opts[name]) {
          path.node.name = state.opts[name];
        }
      },
      MemberExpression(path) {
        if (path.get("object").matchesPattern("process.env")) {
          const key = path.toComputedKey();
          if (t.isStringLiteral(key)) {
            path.replaceWith(t.valueToNode(process.env[key.value]));
          }
        }
      },
      BinaryExpression(path) {
        console.log(path.node.left);
        console.log(path.node.right);
      }
    }
  }
}


index.js

let tips;
let array;
const a = process.env.NODE_ENV



执行babel 编译命令
NODE_ENV="production" ./node_modules/.bin/babel index.js -o output.js


生成 output.js 文件


let newTips;
let array;
const a = "production";




```









其他：
https://www.astexplorer.net/
