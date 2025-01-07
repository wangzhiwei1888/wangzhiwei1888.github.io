---
title: english
date: 2024-12-26 08:55:08
tags: english
categories: english
---

### English-for-Technical-Interviews

### 02-two sum

https://www.bilibili.com/video/BV11h4y1P7Yp/?spm_id_from=333.999.0.0 视频链接
https://leetcode.cn/problems/two-sum/ 题目链接
https://www.collinsdictionary.com/dictionary/ 我喜欢的英文在线字典

- Vocabulary

| 英文                                 | 中文           | 音标        | 重要程度   |
| ------------------------------------ | -------------- | ----------- | ---------- |
| brute force method                   | 暴力法         | bruːt fɔːʳs | 🌟🌟🌟🌟🌟 |
| time complexity                      | 时间复杂度     | kəmpleksɪti | 🌟🌟🌟🌟🌟 |
| n squared                            | n 的平方       | skweəʳd     | 🌟🌟🌟🌟🌟 |
| length                               | 长度           |             | 🌟🌟🌟🌟🌟 |
| array                                | 数组           | əreɪ        | 🌟🌟🌟🌟🌟 |
| element                              | 元素           | elɪmənt     | 🌟🌟🌟🌟🌟 |
| store                                | 存储           |             | 🌟🌟🌟🌟🌟 |
| key-value pair                       | 键值对         |             | 🌟🌟🌟🌟🌟 |
| iterate over / go through this array | 遍历这个数组   | ɪtəˌreɪt    | 🌟🌟🌟🌟🌟 |
| sum up to                            | 总和为         |             | 🌟🌟🌟🌟🌟 |
| add / plus                           | 加上           |             | 🌟🌟🌟🌟🌟 |
| index / indices                      | 索引 （单/复） |             | 🌟🌟🌟🌟🌟 |
| declare a variable                   | 声明一个变量   | dɪkleəʳ     | 🌟🌟🌟🌟🌟 |
| is equal to / equals                 | 等于           | iːkwəl      | 🌟🌟🌟🌟🌟 |
| minus                                | 减去           | maɪnəs      | 🌟🌟🌟🌟🌟 |
| combination                          | 组合           | kɒmbɪneɪʃən | 🌟🌟🌟     |
| Repeat the same steps                | 重复同样的步骤 |             | 🌟🌟🌟     |
| In this case                         | 在这种情况下   |             | 🌟🌟🌟     |
| by default                           | 默认           | dɪfɔːlt     | 🌟🌟🌟     |
| find out                             | 发现           |             | 🌟🌟       |
| difference                           | 差值           |             | 🌟🌟       |
| move on to                           | 移动到         |             | 🌟🌟       |

- Script

- Explain How to Use Brute Force

We have two solutions here. The first one is using brute force method
which has the time complexity: n squared. The solution is that we check out every combination of 2 values and see if they can sum up to our targeting value
which is 8. For example, if we start at 3 then we check every combination
that includes 3
and see if any of the numbers added to 3
so their sum is the target. In this case none of them works.
So we start from 2
repeat the same steps,
and we found out the combination of 2 and 6
their sum is exactly 8.
So we can just directly return their indices
which is 1 and 3.

- Explain Brute Force Code

OK for this brutal force method,
the code goes here.
So firstly we are going to declare a variable called n,
which represents the length of the nums array.
So as we're gonna check out
every combination of two elements from this array,
so we're gonna use a nested for loop to do so.
Inside we have every combination and we will check
if the sum of these two elements is equal to a target. If so
then
we can just directly return the two indices of these numbers
and if not at the end of the program
we will just return an empty array by default.

- Explain How to Use HashMap

The second solution is to use hash map
which has time complexity about O(N). So
we're gonna use this hash map to store key-value pairs
where the key is the element,
and the value is the index of this element.
Then we iterate over this array from the first element 3.
Because now
we are looking for 5 as 3 plus 5 equals 8,
so we will try to check if the map has already
stored five inside.
Unfortunately no,
so we store the current
element and it is index in the map for future usage.

Now we can move on to the next element 2
as the difference between the
target 8 and the current element 2 is 6.
But the map doesn't have it, so we still
store the element and its index.

Move on to 1. Same thing happened we still need to
store the one and its index.

But things are different for six,
as now we're looking for
8 minus 6 equals 2 and the map has 2 inside.
So we can use map
get to get its index, and now we just returned 1 and 3.

- Explain HashMap Code

If we want to use hash map,
then basically we need to declare a map,
where the key
is an integer representing for the element and value is the index.
We iterates over the array, and for each element,
we gonna calculate
the difference between the target and the current element.
We're gonna check
if the difference value word exists in this map or not.
If so, then
also we just directly return the two indices.
If not we simply put the element and it's
index in the map.

At the end of the program
we need to return an empty array by default

### 03 - Spoken English

- Resources

- 发音 & 音标
  https://www.bilibili.com/video/BV1Gs41127iG/?spm_id_from=333.337.search-card.all.click&vd_source=1b467c44a301cea703059eb872a93c8d BBC 发音教程全集

https://www.bilibili.com/video/BV1ma4y1L7NE/?spm_id_from=333.337.search-card.all.click&vd_source=1b467c44a301cea703059eb872a93c8d BBC 六分钟英语第一季合辑

- 连读 & 表达
  https://www.bilibili.com/video/BV1D7411n7bS/?spm_id_from=333.337.top_right_bar_window_default_collection.content.click&vd_source=1b467c44a301cea703059eb872a93c8d BBC 经典教程 | 连读 | 语音语调全集

老友记，优酷或者腾讯视频

### 04 - reverse list

- Vocabulary

| 英文                                       | 中文              | 音标       | 重要程度   |
| ------------------------------------------ | ----------------- | ---------- | ---------- |
| plenty of                                  | 很多              | plenti     | 🌟🌟🌟🌟🌟 |
| head node                                  | 头节点            | hed noʊd   | 🌟🌟🌟🌟🌟 |
| tail node                                  | 尾节点            | teɪl       | 🌟🌟🌟🌟🌟 |
| pointer                                    | 指针              | pɔɪntəʳ    | 🌟🌟🌟🌟🌟 |
| points to                                  | 指向              |            | 🌟🌟🌟🌟🌟 |
| push / add                                 | 推入（栈中）      |            | 🌟🌟🌟🌟🌟 |
| pop out                                    | 拿出（栈中）      |            | 🌟🌟🌟🌟🌟 |
| reverse                                    | 反转              | rɪvɜːʳs    | 🌟🌟🌟🌟🌟 |
| iterate over / go through this linked list | 遍历这个链表      | ɪtəˌreɪt   | 🌟🌟🌟🌟🌟 |
| recursive method                           | 递归法            | rɪˈkɜrsɪv  | 🌟🌟🌟🌟🌟 |
| iterative method                           | 迭代法            | ˈɪtərətɪv  | 🌟🌟🌟🌟🌟 |
| singly linked list                         | 单向链表          |            | 🌟🌟🌟🌟🌟 |
| doubly linked list                         | 双向链表          |            | 🌟🌟🌟🌟🌟 |
| cycle                                      | 循环，圈          | saɪkəl     | 🌟🌟🌟🌟🌟 |
| otherwise                                  | 否则              | ʌðəʳwaɪz   | 🌟🌟🌟🌟🌟 |
| original                                   | 原来的，原本的    | ərɪdʒɪnəl  | 🌟🌟🌟🌟   |
| in the normal case                         | 一般情况下        |            | 🌟🌟🌟🌟   |
| the rest of ...                            | xx 的剩余部分     |            | 🌟🌟🌟🌟   |
| meanwhile ...                              | 同时              | miːnhwaɪl  | 🌟🌟🌟🌟   |
| reaches the end of the linked list ...     | 来到了链表的结尾  |            | 🌟🌟🌟🌟   |
| eventually / finally                       | 最终              | ɪventʃuəli | 🌟🌟🌟     |
| a key takeaway                             | 一个关键要点      |            | 🌟🌟🌟     |
| accordingly                                | 有根据地          |            | 🌟🌟🌟     |
| eliminate                                  | 消除              | ɪlɪmɪneɪt  | 🌟🌟🌟     |
| repeat over and over again until...        | 一直重复，直到... |            | 🌟🌟🌟     |

- Script

### 05 - resume

- Vocabulary

| 英文                          | 中文                 | 音标                     |
| ----------------------------- | -------------------- | ------------------------ |
| design                        | 设计                 | dɪzaɪn                   |
| implement                     | 实现                 | ɪmplɪment                |
| build / establish             | 搭建                 | bɪld / ɪstæblɪʃ          |
| develop                       | 实现                 | dɪveləp                  |
| reduce / decrease             | 降低，减少           | dɪkriːs                  |
| enhance / increase            | 提高，增加           | ɪnhɑːns / ɪnkriːs        |
| improve                       | 提升，完善           | ɪmpruːv                  |
| optimize                      | 优化                 | ɒptɪmaɪz                 |
| significantly / greatly       | 极大地               | sɪgnɪfɪkənt / greɪtli    |
| automate, automated           | 自动化               | ɔːtəmeɪt                 |
| result in                     | 导致...的结果        | ɪtəˌreɪt                 |
| user experience               | 用户体验             | juːzəʳ ɪkspɪəriəns       |
| independently                 | 独立地               | ɪndɪpendənt              |
| seamless                      | 无缝的               | siːmləs                  |
| accelerate / facilitate       | 加速，帮助           | ækseləreɪt / fəsɪlɪteɪt  |
| robust                        | 鲁棒性强的           | roʊbʌst                  |
| stable                        | 稳定的               | steɪbəl                  |
| reliable                      | 可靠的               | rɪlaɪəbəl                |
| extensible / scalable         | 可扩展的             | ɪkˈstɛnsəbəl / skeɪləbəl |
| standardized                  | 标准的               | stændəʳdaɪz              |
| consistent                    | 一致性的             | kənsɪstənt               |
| persistent                    | 持久性的             | pəʳsɪstənt               |
| effective                     | 有效的               | ɪfektɪv                  |
| efficient                     | 有效率的             | ɪfɪʃənt                  |
| isolated                      | 隔离的，独立的       | aɪsəleɪtɪd               |
| standalone                    | 独立的               |                          |
| reusable                      | 可重复利用的         | riːjuːzəbəl              |
| portable                      | 便捷的               | pɔːʳtəbəl                |
| integrate, integrated         | 集成                 | ɪntɪgreɪt                |
| development lifecycle         | 开发周期             |                          |
| metrics                       | 指标                 | ˈmɛtrɪks                 |
| alert                         | 告警                 | əlɜːʳt                   |
| monitoring system             | 监控系统             | ˈmɒnɪtərɪŋ               |
| incident                      | 事故                 | ɪnsɪdənt                 |
| deployment                    | 部署                 | dɪplɔɪmənt               |
| transition                    | 过渡                 | trænzɪʃən                |
| achieve / reach               | 达到，达成           | ətʃiːv / riːtʃ           |
| allow/enable users to do sth. | 允许用户做某事       |                          |
| cross-platform                | 跨平台的             | ɪlɪmɪneɪt                |
| platform                      | 平台                 | plætfɔːʳm                |
| in production                 | 在生产环境中         | prədʌkʃən                |
| maintain                      | 维护                 | meɪnteɪn                 |
| own                           | 负责，拥有           | oʊn                      |
| capability                    | 能力                 | capability               |
| end-to-end                    | 端到端的             |                          |
| manual efforts                | 手动工作             | mænjuəl efəʳts           |
| introduce                     | 引入（框架，工具等） | ɪntrədjuːs               |
| customized                    | 自定义的             | kʌstəˌmaɪzd              |

### 06 - lc 113

- Vocabulary

| 英文                     | 中文         | 重要程度   |
| ------------------------ | ------------ | ---------- |
| DFS / Depth-First-Search | 深度优先遍历 | 🌟🌟🌟🌟🌟 |
| Backtrack                | 回溯         | 🌟🌟🌟🌟🌟 |
| Path                     | 路径         | 🌟🌟🌟🌟🌟 |
| Node                     | 节点         | 🌟🌟🌟🌟🌟 |
| Leaf Node                | 叶子节点     | 🌟🌟🌟🌟🌟 |
| Tree Traversal           | 树的遍历     | 🌟🌟🌟🌟🌟 |
| Global variable          | 全局变量     | 🌟🌟🌟🌟🌟 |
| Initialize               | 初始化       | 🌟🌟🌟🌟🌟 |
| Base case                | 基础情况     | 🌟🌟🌟🌟🌟 |
| Dead-end                 | 死路         | 🌟🌟🌟🌟   |
| Undo                     | 撤回         | 🌟🌟🌟🌟   |
| Explore                  | 探索         | 🌟🌟🌟🌟   |
| Hit / reach              | 碰到 / 达到  | 🌟🌟🌟🌟   |
| Track                    | 追踪，跟踪   | 🌟🌟🌟🌟   |
| Terminate                | 使...结束    | 🌟🌟🌟🌟   |
| Crucial                  | 关键的       | 🌟🌟🌟     |

- Script

Today we will use DFS + backtracking to solve this problem. Basically we need to explore all possible paths from the root node to the leaf node and see if their sum is equal to the target sum. For each node, we use DFS way to track the current sum and all nodes we have gone through. We put those nodes into a list called current path. Once we hit the leaf node, we check if the current sum equals to the target, if so, then we add the current path list to the result to be returned later.  
So another crucial part is, at the end of the DFS function, we need to remove the last node from the current path list, which is called backtracking. So why we need to remove the last node is that we don’t want to consider this case anymore, either because it led to the dead-end, or they have already been explored. Therefore, we undo this choice and we will explore other paths later.

So before starting the DFS, we need to initialize the targetsum as a global variable. Then in the DFS, we can see the base case for this DFS function is to check if the current node is null. If so, we directly terminate the function.
Then we update the current sum by adding the current node’s value, and then update the current path list by adding the current node.
Then if the current node is a leaf node, we can check if the overall sum is equal to the target one. If so, that is one of the valid results to be returned, we add it to the result list.
If not the leaf node, that means we can keep doing tree traversal to go down. We can either choose to go left or go right. After exploring all possible paths starting from the current node, then we do a backtrack to undo the last node added to the path list, which is just the current node.


```

function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

class Solution {
    constructor() {
        this.ret = [];
        this.path = [];
    }

    pathSum(root, targetSum) {
        this.dfs(root, targetSum);
        return this.ret;
    }

    dfs(node, targetSum) {
        if (!node) return;

        this.path.push(node.val);
        targetSum -= node.val;

        if (!node.left && !node.right && targetSum === 0) {
            this.ret.push([...this.path]);
        }

        this.dfs(node.left, targetSum);
        this.dfs(node.right, targetSum);

        this.path.pop();
    }
}

// Helper function to create a binary tree from an array
function arrayToTreeNode(arr) {
    if (!arr || arr.length === 0 || arr[0] === null) return null;

    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;

    while (i < arr.length) {
        const current = queue.shift();

        if (arr[i] !== null) {
            current.left = new TreeNode(arr[i]);
            queue.push(current.left);
        }
        i++;

        if (i < arr.length && arr[i] !== null) {
            current.right = new TreeNode(arr[i]);
            queue.push(current.right);
        }
        i++;
    }

    return root;
}

const solution = new Solution();

const root = arrayToTreeNode([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]);
const targetSum = 22;
console.log(root)

console.log(JSON.stringify(root))
console.log(solution.pathSum(root, targetSum)); // Output: [[5,4,11,2],[5,8,4,5]]

// const root1 = arrayToTreeNode([1, 2, 3]);
// const targetSum1 = 5;
// console.log(solution.pathSum(root1, targetSum1)); // Output: []

// const root2 = arrayToTreeNode([1, 2]);
// const targetSum2 = 0;
// console.log(solution.pathSum(root2, targetSum2)); // Output: []

```

### Resources
https://www.bilibili.com/video/BV1Uu4y1V7Eg/?spm_id_from=333.999.0.0&vd_source=ffda878df0ed45bee1ade91d8f451048

### 07 英文简历

![](../images/english_01.png)

### Resources

https://www.bilibili.com/video/BV11h4y1P7Yp/?spm_id_from=333.999.0.0 视频链接

https://leetcode.cn/problems/path-sum-ii/description/ 题目链接

https://www.collinsdictionary.com/dictionary/ 我喜欢的英文在线字典

在线真人口语练习网站
https://www.free4talk.com/ 可以选择不同的口语 level 的聊天室，免费

---

1、前端英语
https://www.bilibili.com/video/BV1gg411d7if?spm_id_from=333.788.videopod.sections&vd_source=ffda878df0ed45bee1ade91d8f451048

2、英语句子背诵
https://www.bilibili.com/video/BV1eM411a7dB/?spm_id_from=333.337.search-card.all.click&vd_source=ffda878df0ed45bee1ade91d8f451048

3、前端 React 程序员
https://www.bilibili.com/video/BV1tm411R7Qt/?spm_id_from=333.337.search-card.all.click&vd_source=ffda878df0ed45bee1ade91d8f451048

5、程序员英语训练营
https://www.bilibili.com/video/BV1wM4y1C7LE/?spm_id_from=333.337.search-card.all.click&vd_source=ffda878df0ed45bee1ade91d8f451048

6、程序员英语角
https://space.bilibili.com/403317915

7、

![](../images/englist_01.png)

https://www.bilibili.com/video/BV1Kv4y1E72V/?spm_id_from=333.337.search-card.all.click&vd_source=ffda878df0ed45bee1ade91d8f451048

### more frontend interview question:

https://johnsonkow.medium.com/general-frontend-interview-questions-e6186ca4bf2b

https://github.com/h5bp/Front-end-Developer-Interview-Questions?tab=readme-ov-file

https://www.interviewbit.com/front-end-developer-interview-questions/#react-js

https://www.usebraintrust.com/hire/interview-questions/front-end-developers

https://roadmap.sh/questions/frontend

https://www.geeksforgeeks.org/front-end-developer-interview-questions/


react interview questions:

https://github.com/wangzhiwei1888/wangzhiwei1888.github.io/tree/master/docs/