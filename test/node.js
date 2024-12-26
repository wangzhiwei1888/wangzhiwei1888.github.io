
function Node(val) {
    this.val = val;
    this.next = null;
}
// 遍历链表
function traverseLinkedList(head) {
    let current = head;
    while (current !== null) {
        console.log(current.val); // 访问当前节点的值
        current = current.next;   // 移动到下一个节点
    }
}

// 迭代方式
function reverseLinkedList(head) {
    let prev = null;
    let current = head;
    while (current !== null) {
        let nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    return prev; // 新的头节点
}

// 递归方式
function reverseLinkedListRecursive(head) {
    if (head === null || head.next === null) {
        return head;
    }
    let newHead = reverseLinkedListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}


var node1 = new Node(1);
var node2 = new Node(2);
var node3 = new Node(3);
var node4 = new Node(4);
var node5 = new Node(5);
node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;

console.log(node1);


console.log("Original Linked List:");
traverseLinkedList(node1);


// const result = reverseLinkedList(node1);

// console.log(result);

// console.log("Reversed Linked List:");
// traverseLinkedList(result);


const res1 = reverseLinkedListRecursive(node1);

console.log(res1);

console.log("Reversed Linked List:");
traverseLinkedList(res1);




var arr2 = [10, 9, 20, 30, 15, 25, 35, 40, 45, 50];
let num = 0;
// 冒泡排序
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            num++;
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                
            }
        }
    }
}

bubbleSort(arr2)
console.log(arr2, num); // 输出排序后的次数 45 次，数组排序 如何变都是 45 次 O(n^2)


var arr = [9, 10, 15, 20, 25, 30, 35, 40, 45, 50]
num = 0;
// 优化后的冒泡排序
function bubbleSort2(arr) {
    let n = arr.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // 交换 arr[i] 和 arr[i + 1]
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
            num++
        }
        // 每次遍历后，最大的元素会被放到最后，所以可以减少一次遍历
        n--;
    } while (swapped);
    return arr;
}


let sortedArray = bubbleSort2(arr);
console.log("Sorted Array:", sortedArray);
console.log(num); // 输出排序后的次数 9 次, O(n)