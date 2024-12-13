---
title: c语言链表操作
date: 2024-12-13 16:04:41
tags: 
  - 数据结构
  - c
catgories: 
  - 数据结构
  - c
 
---


```


#include <stdio.h>
#include <stdlib.h>

// 定义链表节点结构体
typedef struct Node {
    int data;
    struct Node* next;
} Node;

// 定义链表头结构体
typedef struct LinkedList {
    Node* head;
} LinkedList;

// 创建一个空链表
LinkedList* createLinkedList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    if (list == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    list->head = NULL;
    return list;
}

// 在链表头部插入节点
void insertAtHead(LinkedList* list, int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (newNode == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    newNode->data = data;
    newNode->next = list->head;
    list->head = newNode;
}

// 删除链表中的第一个节点
void deleteFromHead(LinkedList* list) {
    if (list->head == NULL) {
        fprintf(stderr, "List is empty\n");
        return;
    }
    Node* temp = list->head;
    list->head = list->head->next;
    free(temp);
}

// 遍历链表并打印所有节点的数据
void traverseLinkedList(LinkedList* list) {
    Node* current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// 释放链表的所有内存
void freeLinkedList(LinkedList* list) {
    Node* current = list->head;
    Node* temp;
    while (current != NULL) {
        temp = current;
        current = current->next;
        free(temp);
    }
    free(list);
}

int main() {
    // 创建一个空链表
    LinkedList* list = createLinkedList();

    // 插入节点
    insertAtHead(list, 10);
    insertAtHead(list, 20);
    insertAtHead(list, 30);

    // 遍历链表
    printf("Linked List after insertions:\n");
    traverseLinkedList(list);

    // 删除节点
    deleteFromHead(list);
    printf("Linked List after deleting from head:\n");
    traverseLinkedList(list);

    // 释放链表内存
    freeLinkedList(list);

    return 0;
}


```