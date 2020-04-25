---
layout: post
title: "生命游戏"
subtitle: "Leetcode算法题 289"
date: 2020-04-01 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 生命游戏 [[Link]](https://leetcode-cn.com/problems/game-of-life/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
根据[百度百科](https://baike.baidu.com/item/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F/2926434?fr=aladdin)，生命游戏，简称为生命，是英国数学家约翰·何顿·康威在 1970 年发明的细胞自动机。

给定一个包含 m × n 个格子的面板，每一个格子都可以看成是一个细胞。每个细胞都具有一个初始状态：1 即为活细胞（live），或 0 即为死细胞（dead）。每个细胞与其八个相邻位置（水平，垂直，对角线）的细胞都遵循以下四条生存定律：
- 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡；
- 如果活细胞周围八个位置有两个或三个活细胞，则该位置活细胞仍然存活；
- 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡；
- 如果死细胞周围正好有三个活细胞，则该位置死细胞复活；

根据当前状态，写一个函数来计算面板上所有细胞的下一个（一次更新后的）状态。下一个状态是通过将上述规则同时应用于当前状态下的每个细胞所形成的，其中细胞的出生和死亡是**同时发生**的。

示例：
```
输入：
[[0,1,0],
 [0,0,1],
 [1,1,1],
 [0,0,0]]
输出：
[[0,0,0],
 [1,0,1],
 [0,1,1],
 [0,1,0]]
```

## 2. 题解与分析
这题的思路很简单：
- 对于一个细胞，统计这细胞周围8个相邻细胞中活细胞的个数`aliveNum`
- 如果`aliveNum=3`，则这个细胞下一个阶段肯定是活的
- 如果`aliveNum<2 or aliveNum>3`，则这个细胞下一个阶段肯定是死的
- 其他情况，维持当前状态不变

则这个问题的关键有两点：
- 边界细胞怎么处理
- 怎么统计细胞周围活细胞的个数`aliveNum`

首先是处理边界细胞，由于边界细胞不同于中间细胞固定有8个相邻细胞，所以处理方式上需要特别注意。为了能让边界细胞与中间细胞统一进行处理，我在面板四周都 padding 一个死细胞(值为0)。这样在统计活细胞时，边界细胞就不需要特别注意了。

再者就是如何统计周围活细胞的个数，*对于这种在二维数组中每个元素进行相邻元素统计类的操作，都可以用 __卷积__ 来实现*。如此题可用用下面的`kernel`来进行卷积操作：
```
kernel = [[1,1,1],
          [1,0,1],
          [1,1,1]]
```
但这题的kernel尺寸比较小，所以可以用一个简单的循环判断来实现。

## 3. 代码
本题的 `Python` 代码如下：
```python
class Solution(object):
    def gameOfLife(self, board):
        """
        :type board: List[List[int]]
        :rtype: None Do not return anything, modify board in-place instead.
        """

        # get the size of board, and make sure that the board is not empty
        M = len(board)
        if M < 1:
            return
        N = len(board[0])
        if N < 1:
            return

        # a buffer board that is padding with zero
        buff_board = [[0]*(N+2) for _ in range((M+2))]
        for i in range(M+2):
            for j in range(N+2):
                if i!=0 and i!=M+1 and j!=0 and j!=N+1:
                    buff_board[i][j] = board[i-1][j-1]

        for i in range(M):
            for j in range(N):
                sum = 0  # count the number of surrounding alive cells
                for k in range(3):
                    for z in range(3):
                        if k!=1 or z!=1:
                            sum += buff_board[i+k][j+z]
                if sum==3:
                    board[i][j] = 1  # aliveNum=3, the cell will be alive
                elif sum<2 or sum>3:
                    board[i][j] = 0  # aliveNum<2 or aliveNum>3, the cell will be dead
```
