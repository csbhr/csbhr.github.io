---
layout: post
title: "机器人的运动范围"
subtitle: "Leetcode算法题 面试题13"
date: 2020-04-07 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 机器人的运动范围 [[Link]](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

**涉及知识点：图的遍历**

## 1. 题目描述
地上有一个 `m` 行 `n` 列的方格，从坐标 `[0,0]` 到坐标 `[m-1,n-1]` 。一个机器人从坐标 `[0, 0]` 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于 `k` 的格子。例如，当 `k` 为 $18$ 时，机器人能够进入方格 `[35, 37]` ，因为 $3+5+3+7=18$。但它不能进入方格 `[35, 38]`，因为 $3+5+3+8=19$。请问该机器人能够到达多少个格子？

限制：
- `1 <= n, m <= 100`
- `0 <= k <= 20`

示例 1 :
```
输入：m = 2, n = 3, k = 1
输出：3
```
示例 2 :
```
输入：m = 3, n = 1, k = 0
输出：1
```

## 2. 题解与思路
本题只需要从坐标 `[0,0]` 出发，对方格朝上下左右进行遍历即可，可以使用 **深度优先遍历** 或 **广度优先遍历**

遍历过程的 **注意/技巧** ：
- 遍历过的坐标要标记，避免重复遍历，即要维护一个 `bool` 数组 `is_visit`，来标记是否访问过
- 因为起点在 `[0,0]`，不需要朝四个方向遍历，只需要朝 **右** 和 **下** 遍历就可以覆盖整个方格，可以节省计算量
- 由于 `1 <= n, m <= 100` 的限制，所以在计算数位之和时，不需要使用循环遍历数位，只需要考虑两位数即可，也可以节省计算量

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def count(self, i, j):
        return i // 10 + i % 10 + j // 10 + j % 10

    def DFS(self, i, j, m, n, k):
        if i < 0 or j < 0 or i >= m or j >= n or self.is_visit[i][j] or self.count(i, j) > k:
            return 0
        self.is_visit[i][j] = True
        return self.DFS(i, j + 1, m, n, k) + self.DFS(i + 1, j, m, n, k) + 1  # just right and down

    def movingCount(self, m, n, k):
        """
        :type m: int
        :type n: int
        :type k: int
        :rtype: int
        """
        self.is_visit = [[False for _ in range(n)] for _ in range(m)]
        return self.DFS(0, 0, m, n, k)
```
