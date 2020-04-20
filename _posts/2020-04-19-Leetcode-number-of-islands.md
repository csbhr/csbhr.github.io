---
layout: post
title: "岛屿数量"
subtitle: "Leetcode 2020-04-20 每日一题"
date: 2020-04-19 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 图的遍历
    - 并查集
---

# 岛屿数量 [[Link]](https://leetcode-cn.com/problems/number-of-islands/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

示例 1：
```
输入:
11110
11010
11000
00000
输出: 1
```

示例 2：
```
输入:
11000
11000
00100
00011
输出: 3
解释: 每座岛屿只能由水平和/或竖直方向上相邻的陆地连接而成。
```

注：语文没学好，还真看不懂这题的题意，这题的题意其实是：计算 `'1'` 的联通区域的个数，其中只有水平和垂直方向才算联通。

## 2. 解法一（图的遍历）

### 2.1 题解与分析
既然是计算联通区域的个数，所以可以利用图的遍历来完成，可以知道：**图的一次深度/广度优先遍历，只能遍历一个联通区域**，所以只要计算启动深度/广度优先遍历的次数即可。

深度优先和广度优先都可以，这里采用深度优先遍历为例。

### 2.2 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def numIslands(self, grid):
        """
        :type grid: List[List[str]]
        :rtype: int
        """
        M = len(grid)
        if M <= 0:
            return 0
        N = len(grid[0])
        if N <= 0:
            return 0

        is_visit = [[False for _ in range(N)] for _ in range(M)]
        count = 0

        for i in range(M):
            for j in range(N):
                if grid[i][j]=='1' and not is_visit[i][j]:
                    S = [(i, j)]
                    count += 1  # 启动一次深度优先遍历
                    while len(S) > 0:
                        z, k = S.pop()
                        is_visit[z][k] = True
                        if z-1>=0 and grid[z-1][k]=='1' and not is_visit[z-1][k]:
                            S.append((z-1, k))
                        if z+1<M and grid[z+1][k]=='1' and not is_visit[z+1][k]:
                            S.append((z+1, k))
                        if k-1>=0 and grid[z][k-1]=='1' and not is_visit[z][k-1]:
                            S.append((z, k-1))
                        if k+1<N and grid[z][k+1]=='1' and not is_visit[z][k+1]:
                            S.append((z, k+1))
        return count
```

## 3. 解法二（并查集）

### 2.1 题解与分析
本题其实是一个集合合并的问题，可以采用并查集的思路来处理，主要思路是：
- 初始时，每个 `'1'`（陆地）作为单独的集合
- 遍历图，相邻的 `'1'` 可以看做一个边，每遇到一次边，就把边连接的两个集合合并
- 最终剩余的集合的数目就是联通区域的个数

关键在于如何定义并查集的数据结构呢？
- 为每一个元素都维护一个指针，指向父亲 `parent`
- 确定每个元素属于哪个结合，就可以根据父亲指针来寻找该元素的 **祖先**，有相同祖先的元素是属于一个集合的
- 合并两个集合，只要找到这两个集合元素的祖先，然后把一个集合的祖先作为另一个集合祖先的父亲即可，这样两个集合的元素都拥有了相同祖先。
- 同时维护一个集合个数 `count`，初始值为元素的个数，每合并一次就 `count -= 1`

> 关于并查集的介绍，这个博客[Blog](https://blog.csdn.net/qq_41861526/article/details/80469494)解释的很好，值得学习。

下面代码可以作为 **定义并查集** 的模板代码。

### 2.2 代码
本解法 `Python` 代码如下
```python
class UnionSearch:  # 定义并查集
    def __init__(self, grid):
        self.count = 0  # 集合个数
        M, N = len(grid), len(grid[0])
        self.parent = [-1]*(M*N)  # 父亲指针
        for i in range(M):
            for j in range(N):
                if grid[i][j] == '1':
                    this_flag = i*N+j
                    self.parent[this_flag] = this_flag  # 初始时，父亲指针指向自己，即每个元素单独作为一个集合
                    self.count += 1

    def search(self, target_flag):
        # 利用父亲指针，寻找祖先
        while not self.parent[target_flag] == target_flag:
            target_flag = self.parent[target_flag]
        return self.parent[target_flag]

    def union(self, flag_a, flag_b):
        parent_a = self.search(flag_a)  # 寻找祖先
        parent_b = self.search(flag_b)  # 寻找祖先
        if not parent_a == parent_b:  # 利用祖先判断是不是属于一个集合
            # 把一个集合的祖先作为另一个集合祖先的父节点，这样两个集合的元素都拥有了相同祖先，实现了合并
            self.parent[parent_a] = parent_b
            self.count -= 1  # 集合数目减一

class Solution(object):

    def numIslands(self, grid):
        """
        :type grid: List[List[str]]
        :rtype: int
        """
        M = len(grid)
        if M <= 0:
            return 0
        N = len(grid[0])
        if N <= 0:
            return 0

        union_S = UnionSearch(grid)

        for i in range(M):
            for j in range(N):
                if grid[i][j] == '1':
                    flag_a = i*N+j
                    if i-1>=0 and grid[i-1][j]=='1':  # 为每个边实现合并
                        flag_b = (i-1)*N+j
                        union_S.union(flag_a, flag_b)
                    if i+1<M and grid[i+1][j]=='1':
                        flag_b = (i+1)*N+j
                        union_S.union(flag_a, flag_b)
                    if j-1>=0 and grid[i][j-1]=='1':
                        flag_b = i*N+j-1
                        union_S.union(flag_a, flag_b)
                    if j+1<N and grid[i][j+1]=='1':
                        flag_b = i*N+j+1
                        union_S.union(flag_a, flag_b)

        return union_S.count
```
