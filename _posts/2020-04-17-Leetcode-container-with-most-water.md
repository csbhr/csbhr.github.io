---
layout: post
title: "盛最多水的容器"
subtitle: "Leetcode算法题 11"
date: 2020-04-17 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 双指针
---

# 盛最多水的容器 [[Link]](https://leetcode-cn.com/problems/container-with-most-water/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给你 `n` 个非负整数 `a1，a2，...，an`，每个数代表坐标中的一个点 `(i, ai)` 。在坐标内画 `n` 条垂直线，垂直线 `i` 的两个端点分别为 `(i, ai)` 和 `(i, 0)`。找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

说明：你不能倾斜容器，且 `n` 的值至少为 `2`。

![盛最多水的容器](https://s1.ax1x.com/2020/04/19/JMeAjs.png)

示例 1：
```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
```

## 2. 题解与思路
采用 **双指针** 的思路，维护两个指针 `l` 和 `r`，表示盛水容器的左壁和右壁，初始时，两个指针分别在最左侧和最右侧，我们要做的就是缩小这个容器，然后挑出容量最大的容器。

所以算法的思路就是：
- 当 `l<r` 时，就计算当前容器的容量，计算方式为 `min(height[l], height[r]) * (r-l)`，然后记录当前容量最大值。
- 然后缩小容器，到底该移动哪个指针呢？结论是：应该移动 `height` 小的指针。

**移动 `height` 小的指针的原因：假设 `height[l]<height[r]`，由于接下来遍历的容器的长度 `r-l` 是在减小的，如果保持 `l` 作为容器的左壁，那么接下来的容器的容量都不会超过当前容器的容量，所以没有必要保持 `l` 作为容器的左壁，所以应该移动 `l`**

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def maxArea(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        l, r = 0, len(height)-1  # 左右两个指针
        max_water = 0
        while l<r:
            this_water = min(height[l], height[r]) * (r - l)  # 当前容器容量
            max_water = max(max_water, this_water)  # 记录当前容量最大值
            if height[l] <= height[r]:  # 移动 `height` 小的指针
                l += 1
            else:
                r -= 1
        return max_water
```
