---
layout: post
title: "接雨水"
subtitle: "Leetcode 2020-04-04 每日一题"
date: 2020-04-03 22:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 接雨水 [[Link]](https://leetcode-cn.com/problems/trapping-rain-water/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。  
![rainwatertrap](https://s1.ax1x.com/2020/04/04/GwXasf.png)
上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

示例:
```
输入: [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6
```

## 2. 题解与思路
这道题的解题思路是：
- 每个柱子维护两个状态：`is_drown`和`water_height`，其中`is_drown`是`bool`值，用于判定这个柱子有没有被淹没，初始值为`False`；`water_height`是这个柱子被水淹没后的总高度，初始值为`0`。
- 对每一个没有被淹没的柱子，以该柱子`now`的高度`now_height`，分别向左和向右进行淹没，被淹没的柱子置`is_drown=True`，`water_height=now_height`。
- 最后计算`water_height`与`height`的差值，就是雨水的数量。

则关键在于怎样向左和向右淹没呢？以向左为例（向右类似），我采取的方式是：
- 初始化淹没的左边界`left=now`，向左遍历
- 若遇到比`now_height`低的柱子，则继续向左
- 若遇到与`now_height`相同的柱子`this`，则记录`left=this`，继续向左
- 若遇到比`now_height`高的柱子`this`，因为这个柱子不能被淹没，则记录`left=this+1`，停止遍历
- 将`left->now`的柱子全部置`is_drown=True`，`water_height=now_height`。

## 3. 代码
本题的 `Python` 代码如下：
```python
class Solution(object):
    def trap(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        is_drown = [False] * len(height)  # if True: this column is drown out
        water_height = [0] * len(height)  # the total height after been drown out
        for now in range(len(height)):
            if not is_drown[now]:  # if been drown out, this column will not be considered
                left = now
                right = now
                for l in range(now)[::-1]:  # flood left
                    if height[l] > height[now]:
                        left = l + 1
                        break
                    elif height[l] == height[now]:
                        left = l
                for r in range(now+1, len(height)):  # flood right
                    if height[r] > height[now]:
                        right = r - 1
                        break
                    elif height[r] == height[now]:
                        right = r
                for i in range(left, right+1):
                    is_drown[i] = True
                    water_height[i] = height[now]
        num_right = 0
        for h, w in zip(height, water_height):  # calcuate the water number
            num_right += w-h
        return num_right
```
