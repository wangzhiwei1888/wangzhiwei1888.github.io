---
title: node addon 扩展 node c++扩展
date: 2024-12-25 10:37:55
tags:
  - node
  - nodejs
  - node addon
  - node c++
categories:
  - node
  - c++
---


# node addon 扩展 node c++扩展

## 安装 node-gyp

npm install -g node-gyp


```
.
└── caddon
    ├── binding.gyp
    ├── build
    ├── calculate1.cc
    ├── calculate.cc
    ├── hello.cc
    ├── hello.js
    ├── main.js
    ├── package.json
    └── README.md


binding.gyp

{
    "targets": [
        {
            "target_name": "calculate",
            "sources": [ "calculate.cc" ]
        }, 
        {
            "target_name": "calculate1",
            "sources": [ "calculate1.cc" ]
        }, 
        {
            "target_name": "hello",
            "sources": [ "hello.cc" ]
        }
    ]

}

calculate1.cc

#include <node.h>

namespace calculate1 {
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::Number;
    using v8::Value;
    using v8::String;
    using v8::Exception;

    void Method(const FunctionCallbackInfo<Value>&args) {
        Isolate* isolate = args.GetIsolate();


        // 检查参数数量
        if (args.Length() < 2) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong number of arguments").ToLocalChecked()));
            return;
        }

        if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
            return;
        }

        int x = args[0]->NumberValue(isolate->GetCurrentContext()).FromJust();
        int y = args[1]->NumberValue(isolate->GetCurrentContext()).FromJust();


        int i;
        // double x = 100.734659, y = 353.2313423432;
        for (i=0; i < 100; i++) {
            x += y;
        }
        auto total = Number::New(isolate, x);
        args.GetReturnValue().Set(total);
    }

    void Initialize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "calc1", Method);
    }
    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
}

main.js

const calculate = require('./build/Release/calculate')
const calculate1 = require('./build/Release/calculate1')
const hello = require('./build/Release/hello')
const hello_js = require('./hello.js')

function calc() {
    let i, x =  100.734659, y=353.2313423432;
    for (i=0; i<1000000000; i++) {
        x += y;
    }
    const total = x
    return total
}
console.log('c++ addon result vs Node result')
console.log('C++ :' + calculate.calc())
console.log('Node :' + calc())
console.log('---------------------------------------')
console.log('c++ addon vs js addon')
console.log(hello.hello())
console.log(hello_js('Jack Yeh'))


console.log('c++ addon')


console.log('C++ :' + calculate1.calc1(100, 100))



更多参考：https://github.com/wangzhiwei1888/cpp_node_modules.git

```

编译c++

```
node-gyp configure
node-gyp build

```

运行

```
node main.js

```