---
title: c_plusplus _ c 混合编译
date: 2024-12-13 16:02:04
tags: 
  - c++
  - c
  - 混合编译
categories: 
  - c++
  - c
  - 混合编译

---


c++调用c

project/
├── example.c
├── example.h
└── main.cpp

example.h

```
#ifndef EXAMPLE_H
#define EXAMPLE_H

#ifdef __cplusplus
extern "C" {
#endif

void c_function(int a, int b);

#ifdef __cplusplus
}
#endif

#endif // EXAMPLE_H

```
example.c

```
#include "example.h"
#include <stdio.h>

void c_function(int a, int b) {
    printf("C function called with %d and %d\n", a, b);
}

```

c++代码

main.cpp


```
#include "example.h"
#include <stdio.h>

void c_function(int a, int b) {
    printf("C function called with %d and %d\n", a, b);
}

```


编译命令

```
 g++ -o minxed_example main.cpp example.c 
 ./minxed_example
  
 输出结果：
Calling C function from C++
C function called with 10 and 20

```

C调用C++

.
├── cpp_interface.cpp
└── main.c


cpp_interface.cpp


```
// cpp_interface.cpp

#include <iostream>

// 声明一个C++类
class MyClass {
public:
    void printMessage() {
        std::cout << "Hello from C++!" << std::endl;
    }
};

// 使用 extern "C" 来防止名称修饰
extern "C" {
    // 创建对象
    void* create_my_class() {
        return new MyClass();
    }

    // 调用成员函数
    void call_print_message(void* obj) {
        static_cast<MyClass*>(obj)->printMessage();
    }

    // 销毁对象
    void destroy_my_class(void* obj) {
        delete static_cast<MyClass*>(obj);
    }
}

```

main.c


```

// main.c

#include <stdio.h>
#include <stdlib.h>

// 声明C++接口函数
void* create_my_class();
void call_print_message(void* obj);
void destroy_my_class(void* obj);

int main() {
    // 创建C++对象
    void* my_obj = create_my_class();

    // 调用C++对象的方法
    call_print_message(my_obj);

    // 销毁C++对象
    destroy_my_class(my_obj);

    return 0;
}

```


编译命令

```
g++ -c cpp_interface.cpp -o cpp_interface.o
gcc main.c cpp_interface.o -lstdc++ -o main
./main

输出结果：
Hello from C++!

```