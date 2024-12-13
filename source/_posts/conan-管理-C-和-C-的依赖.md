---
title: conan 管理 C 和 C++ 的依赖
date: 2024-12-13 15:56:55
tags: 
  - C
  - C++
  - conan
categories: 
  - C
  - C++
  - conan
---


```

conanfile.txt
[requires]
libcurl/8.10.1

[generators]
CMakeDeps
CMakeToolchain

main.c

#include <stdio.h>
#include <curl/curl.h>

int main(void) {
    CURL *curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://www.baidu.com");
        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            fprintf(stderr, "curl_easy_perform() failed: %s\n",
                    curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();

    return 0;
}


.
├── build
│   ├── CMakeCache.txt
│   └── CMakeFiles
│       ├── 3.16.3
│       ├── cmake.check_cache
│       ├── CMakeOutput.log
│       └── CMakeTmp
├── conanfile.txt
├── main
└── main.c

进入 build 目录
conan install .. --build=missing

gcc -o main main.c -lcurl


```