---
layout: post
title: "01 矩阵"
subtitle: "Leetcode算法题 542"
date: 2020-04-14 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 01 矩阵 [[Link]](https://leetcode-cn.com/problems/01-matrix/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

**涉及知识点：图的遍历**

## 1. 题目描述
给定一个由 `0` 和 `1` 组成的矩阵，找出每个元素到最近的 `0` 的距离。

两个相邻元素间的距离为 `1` 。

注意:
- 给定矩阵的元素个数不超过 `10000`。
- 给定矩阵中至少有一个元素是 `0`。
- 矩阵中的元素只在四个方向上相邻: 上、下、左、右。


示例 1：
```
输入:
  0 0 0
  0 1 0
  0 0 0
输出:
  0 0 0
  0 1 0
  0 0 0
```

示例 2：
```
输入:
  0 0 0
  0 1 0
  1 1 1
输出:
  0 0 0
  0 1 0
  1 2 1
```

## 2. 题解与思路
本题是典型的的 **图的广度优先遍历** 的应用。

以元素为 0 的点开始进行广度优先遍历，遍历方向为上下左右四个方向。广度优先遍历要用到 **队列 Queue**，同时还需要记录当前点有没有被访问 **is_visit**。

广度优先遍历时，遍历的深度就是当前点距离 0 元素的距离。这可以用“记录每层最后元素”的方式来判定当前深度，但为了操作方便，我们为每一个进入队列的元素都显式记录一个深度，当遍历到新元素时，深度就在当前深度的基础上加一，最后这个深度就是此题解想要的距离 0 元素的距离。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def updateMatrix(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: List[List[int]]
        """
        Queue = []  # 队列
        M, N = len(matrix), len(matrix[0])
        is_visit = [[False for _ in range(N)] for _ in range(M)]  # 标记是否被访问
        distance = [[0 for _ in range(N)] for _ in range(M)]  # 深度矩阵

        for i in range(M):
            for j in range(N):
                if matrix[i][j] == 0:
                    is_visit[i][j] = True
                    distance[i][j] = 0
                    Queue.append((i, j, 0))  # 从元素为 0 的点作为起点出发，记录此点的距离为 1

        while len(Queue) > 0:
            i, j, dis = Queue.pop(0)
            if i-1>=0 and not is_visit[i-1][j]:  # 向上
                is_visit[i-1][j] = True
                distance[i-1][j] = dis + 1  # 深度要加 1
                Queue.append((i-1, j, dis+1))
            if i+1<M and not is_visit[i+1][j]:  # 向下
                is_visit[i+1][j] = True
                distance[i+1][j] = dis + 1
                Queue.append((i+1, j, dis+1))
            if j-1>=0 and not is_visit[i][j-1]:  # 向左
                is_visit[i][j-1] = True
                distance[i][j-1] = dis + 1
                Queue.append((i, j-1, dis+1))
            if j+1<N and not is_visit[i][j+1]:  # 向右
                is_visit[i][j+1] = True
                distance[i][j+1] = dis + 1
                Queue.append((i, j+1, dis+1))

        return distance
```
