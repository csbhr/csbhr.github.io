---
layout: post
title: "交点"
subtitle: "Leetcode算法题 面试题16.03"
date: 2020-04-11 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 交点 [[Link]](https://leetcode-cn.com/problems/intersection-lcci/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定两条线段（表示为起点 `start = {X1, Y1}` 和终点 `end = {X2, Y2}`），如果它们有交点，请计算其交点，没有交点则返回空值。

要求浮点型误差不超过 $10^{-6}$。若有多个交点（线段重叠）则返回 `X` 值最小的点，`X` 坐标相同则返回 `Y` 值最小的点。

提示：
- 坐标绝对值不会超过 $2^7$
- 输入的坐标均是有效的二维坐标

示例 1：
```
输入：
line1 = {0, 0}, {1, 0}
line2 = {1, 1}, {0, -1}
输出： {0.5, 0}
```

示例 2：
```
输入：
line1 = {0, 0}, {3, 3}
line2 = {1, 1}, {2, 2}
输出： {1, 1}
```

示例 3：
```
输入：
line1 = {0, 0}, {1, 1}
line2 = {1, 0}, {2, 1}
输出： {}，两条线段没有交点
```

## 2. 题解与思路
采用 **参数方程** 来做，这里用 **斜截式**，即$y=kx+b$，使用斜截式，要单独考虑斜率不存在的情况。

这题主要的思路就是：
- 使用参数方程可以计算出线段所在的两条直线的交点
- 判断交点是否在两条线段定义域的重合区域内

主要的情况有：
- 若两条线段的定义域没有重合，则不存在交点，返回空
- 若两条直线的斜率都存在：
  - 若两条直线平行：
    - 这两条直线重合，返回定义域最小点
    - 若两条直线不重合，则无交点
  - 若两条直线不平行，则计算出交点，判断是够在重合的定义域内，在则返回该点，否则返回空
- 若一条直线斜率存在，一条直线斜率不存在（垂直），则交点在垂直的直线上，计算出交点，返回
- 若两条直线的斜率都不存在，说明是两条重合的垂直线，则判断值域是否有重合，有则返回值域最小点，否则返回空

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def get_k_b(self, start, end):
        if start[0] - end[0] == 0:  # 斜率不存在
            k = None
            b = None
        else:  # 斜率存在
            k = float(start[1] - end[1]) / (start[0] - end[0])
            b = start[1] - k * start[0]
        return k, b

    def intersection(self, start1, end1, start2, end2):
        """
        :type start1: List[int]
        :type end1: List[int]
        :type start2: List[int]
        :type end2: List[int]
        :rtype: List[float]
        """
        left1, right1 = min(start1[0], end1[0]), max(start1[0], end1[0])
        left2, right2 = min(start2[0], end2[0]), max(start2[0], end2[0])
        left, right = max(left1, left2), min(right1, right2)  # 定义域重合区域
        if left > right:
            return []  # 定义域不重合

        k1, b1 = self.get_k_b(start1, end1)  # 线段1的斜率式
        k2, b2 = self.get_k_b(start2, end2)  # 线段2的斜率式

        if k1 is not None and k2 is not None:  # 两个线段斜率都存在
            if k1 == k2:  # 平行
                if b1 == b2:
                    re_x = float(left)  # 处于一条直线，取重合区域最小点
                    return [re_x, k1 * re_x + b1]
                else:
                    return []  # 不在一条直线，无交点
            else:
                re_x = (b2 - b1) / (k1 - k2)  # 不平行，计算出交点
                if left <= re_x <= right:
                    return [re_x, k1 * re_x + b1]  # 交点在重合区域
                else:
                    return []  # 交点不在重合区域
        else:
            if k1 is not None:
                re_x = float(start2[0])  # 线段2垂直，交点在线段2上
                if left <= re_x <= right:
                    return [re_x, k1 * re_x + b1]  # 交点在重合区域
                else:
                    return []  # 交点不在重合区域
            elif k2 is not None:
                re_x = float(start1[0])  # 线段1垂直，交点在线段1上
                if left <= re_x <= right:
                    return [re_x, k2 * re_x + b2]  # 交点在重合区域
                else:
                    return []  # 交点不在重合区域
            else:
                down1, up1 = min(start1[1], end1[1]), max(start1[1], end1[1])
                down2, up2 = min(start2[1], end2[1]), max(start2[1], end2[1])
                down, up = max(down1, down2), min(up1, up2)  # 两条线都垂直，值域重合区域
                if down <= up:
                    return [float(left), float(down)]  # 值域重合，取重合区域最小点
                else:
                    return []
```
