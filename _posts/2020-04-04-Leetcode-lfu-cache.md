---
layout: post
title: "LFU缓存"
subtitle: "Leetcode 面试题"
date: 2020-04-04 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# LFU缓存
[Leetcode Link](https://leetcode-cn.com/problems/lfu-cache/)

## 1. 题目描述
设计并实现 [最不经常使用（LFU）](https://baike.baidu.com/item/%E7%BC%93%E5%AD%98%E7%AE%97%E6%B3%95)缓存的数据结构。它应该支持以下操作：`get` 和 `put`。

`get(key)` ：如果键存在于缓存中，则获取键的值（总是正数），否则返回 -1。  
`put(key, value)` ：如果键不存在，请设置或插入值。当缓存达到其容量时，它应该在插入新项目之前，使最不经常使用的项目无效。在此问题中，当存在平局（即两个或更多个键具有相同使用频率）时，最近最少使用的键将被去除。

进阶：
你是否可以在 $O(1)$ 时间复杂度内执行两项操作？

示例 :
```
LFUCache cache = new LFUCache( 2 /* capacity (缓存容量) */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回 1
cache.put(3, 3);    // 去除 key 2
cache.get(2);       // 返回 -1 (未找到key 2)
cache.get(3);       // 返回 3
cache.put(4, 4);    // 去除 key 1
cache.get(1);       // 返回 -1 (未找到 key 1)
cache.get(3);       // 返回 3
cache.get(4);       // 返回 4
```

## 2. 题解与思路
这题要求时间复杂度达到 $O(1)$，所以应该用空间来换取时间的效率。

为了能够快速查找和标记访问频次，需要维护一个哈希表 `hashMap` 和一个访问次数表 `freqTable`，其中：
- 哈希表 `hashMap` 为了能够以 $O(1)$ 的效率查找到节点
- 访问次数表 `freqTable` 为了标记访问频次，把相同访问频次的节点连接成一个双向链表，这些双向链表存储在访问次数表 `freqTable`中
- 使用双向链表的原因是为了能够快速访问到尾部节点，每一个双向链表中的访问频次相同，但链表尾部节点比头部节点存在的时间长，同等访问频次下会优先删除尾部的节点
- 每次访问某各节点，这个节点会从当前频次链表中拿出，并挂到下一个频次链表的头部
- 当需要删除某个节点时，**先看访问频次，再看访问时间** ，从低频次开始遍历访问次数表 `freqTable`，找到最低访问频次的链表，再删除尾部节点

在 leetcode 题解中看到一张图表达的很清晰，[原链接](https://leetcode-cn.com/problems/lfu-cache/solution/ha-xi-biao-shuang-xiang-lian-biao-java-by-liweiwei/)  
![图解](https://s1.ax1x.com/2020/04/05/GDlAk8.png)

## 3. 代码
本解法 `Python` 代码如下
```python
class Node(object):
    def __init__(self, key=-1, value=-1, freq=0):
        '''
        the node of double linked list
        '''
        self.key = key
        self.value = value
        self.freq = freq
        self.pre = self
        self.post = self

    @staticmethod
    def pop(this_node):
        '''
        pop this_node from link
        '''
        tmp = this_node.pre
        tmp.post = this_node.post
        tmp.post.pre = tmp

    @staticmethod
    def append(pre_node, this_node):
        '''
        append this_node behind pre_node
        '''
        this_node.post = pre_node.post
        this_node.pre = pre_node
        pre_node.post = this_node
        this_node.post.pre = this_node


class LFUCache(object):

    def __init__(self, capacity):
        """
        :type capacity: int
        """
        self.capacity = capacity
        self.size = 0
        self.hashMap = {}  # Hash Map for quickly search
        self.freqTable = [Node(freq=i) for i in range(100)]  # Frequency Table for deciding which node should be delete

    def get(self, key):
        """
        :type key: int
        :rtype: int
        """
        if key not in self.hashMap:
            return -1

        this_node = self.hashMap[key]
        Node.pop(this_node)  # pop this node from this frequency link

        to_append_node = self.freqTable[this_node.freq + 1]  # append this node to next frequency link
        this_node.freq += 1
        Node.append(to_append_node, this_node)

        return this_node.value

    def put(self, key, value):
        """
        :type key: int
        :type value: int
        :rtype: None
        """
        if self.capacity == 0:
            return

        if key in self.hashMap:  # if this key is exist, reset the value, and append to next frequency link
            this_node = self.hashMap[key]
            Node.pop(this_node)
            to_append_node = self.freqTable[this_node.freq + 1]
            this_node.freq += 1
            this_node.value = value
            Node.append(to_append_node, this_node)
            return

        if self.size >= self.capacity:  # if the cache is full, delete one node
            for i in range(len(self.freqTable)):  # find the least frequently used link
                head = self.freqTable[i]
                if not head.post == head:
                    to_pop_node = head.pre  # delete tail node
                    Node.pop(to_pop_node)
                    self.hashMap.pop(to_pop_node.key)
                    self.size -= 1
                    break

        new_node = Node(key=key, value=value)  # append the new node to first frequency link
        to_append_node = self.freqTable[0]
        Node.append(to_append_node, new_node)
        self.hashMap[key] = new_node
        self.size += 1
```
