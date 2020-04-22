---
layout: post
title: "二叉树的右视图"
subtitle: "Leetcode 2020-04-22 每日一题"
date: 2020-04-21 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 二叉树操作
---

# 二叉树的右视图 [[Link]](https://leetcode-cn.com/problems/binary-tree-right-side-view/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

示例：
```
输入: [1,2,3,null,5,null,4]
输出: [1, 3, 4]
解释:

   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---
```

## 2. 题解与分析
右视图，实际上就是二叉树每层的最右边的节点，可以用 **层次遍历** 来解决。

主要思路就是：
- 对二叉树进行层次遍历，为了方便操作，可以为每个节点维护一个变量 `level` 来记录当前节点所在的层次。
- 输出每层最后一个节点即可。

## 3. 代码
本解法 `Python` 代码如下
```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def rightSideView(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        Q = []  # 队列， 用于层次遍历
        level_search = {}  # 存储层次遍历的结果，为了方便操作，用字典存储，key是层数，value是该层的元素
        if root is not None:
            Q.append((root, 0))  # 开始层次遍历，并记录每个节点的层数
        while len(Q) > 0:
            this_node, level = Q.pop(0)
            if level not in level_search:
                level_search[level] = []
            level_search[level].append(this_node.val)  # 把该节点放到对应的层中
            if this_node.left is not None:
                Q.append((this_node.left, level+1))
            if this_node.right is not None:
                Q.append((this_node.right, level+1))

        res = []
        for k in level_search.keys():
            res.append(level_search[k][-1])  # 输出每层最后一个节点
        return res
```
