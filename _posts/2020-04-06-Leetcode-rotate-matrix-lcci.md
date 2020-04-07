---
layout: post
title: "旋转矩阵"
subtitle: "Leetcode 2020-04-07 每日一题"
date: 2020-04-06 22:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 编辑距离 [[Link]](https://leetcode-cn.com/problems/rotate-matrix-lcci/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给你一幅由 $N × N$ 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。

不占用额外内存空间能否做到？

示例 1 :
```
给定 matrix =
[ [1,2,3],
  [4,5,6],
  [7,8,9] ],

原地旋转输入矩阵，使其变为:
[ [7,4,1],
  [8,5,2],
  [9,6,3] ]
```
示例 2 :
```
给定 matrix =
[ [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16] ],

原地旋转输入矩阵，使其变为:
[ [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11] ]
```

## 2. 题解与思路
本题要求 **不占用额外内存空间** ，实际上是要求空间复杂度达到 $O(1)$ ，因此不能使用与输入 `matrix` 尺寸相关的缓存空间，能使用的只能是一个临时变量 `tmp`，这就要求只能采取 **点对点** 的位置交换，即只能采用 **翻转（对折）** 的方式实现。有几种方式：**水平翻转**、**垂直翻转**、**沿主对角线翻转**、**沿副对角线翻转**。

而本题要求的 **顺时针旋转 90 度** 只能通过上面四种方式的组合来实现，下面列举常见的旋转对应的组合方式：
- 顺时针旋转 90 度：沿主对角线翻转 + 水平翻转
- 逆时针旋转 90 度：沿主对角线翻转 + 垂直翻转
- 旋转 180 度：水平翻转 + 垂直翻转

下图为 **顺时针旋转 90 度** 的示意图：  
![示意图](https://s1.ax1x.com/2020/04/07/Gcniwt.png)

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def rotate(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: None Do not return anything, modify matrix in-place instead.
        """
        N = len(matrix)
        if N <= 0:
            return

        for i in range(N):  # flip diagonally
            for j in range(i, N):
                tmp = matrix[i][j]
                matrix[i][j] = matrix[j][i]
                matrix[j][i] = tmp

        for i in range(N):  # flip horizontally
            for j in range(N//2):
                tmp = matrix[i][j]
                matrix[i][j] = matrix[i][N-j-1]
                matrix[i][N-j-1] = tmp
```
