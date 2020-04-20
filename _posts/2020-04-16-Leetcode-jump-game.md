---
layout: post
title: "跳跃游戏"
subtitle: "Leetcode 2020-04-17 每日一题"
date: 2020-04-16 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 贪心算法
---

# 跳跃游戏 [[Link]](https://leetcode-cn.com/problems/jump-game/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定一个非负整数数组，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个位置。

示例 1：
```
输入: [2,3,1,1,4]
输出: true
解释: 我们可以先跳 1 步，从位置 0 到达 位置 1, 然后再从位置 1 跳 3 步到达最后一个位置。
```

示例 2：
```
输入: [3,2,1,0,4]
输出: false
解释: 无论怎样，你总会到达索引为 3 的位置。但该位置的最大跳跃长度是 0 ， 所以你永远不可能到达最后一个位置。
```

## 2. 题解与思路
使用 **贪心算法** 来解决这个问题：想要知道是否能够到达最后一个位置，只需要知道从第一个位置出发，所能到达的最远的位置有没有超过最后位置就可以了。

关键在于：如何求得能到达的最远位置。这里就要用到贪心算法，维护一个当前能到达的最远距离 `max_arrive`，遍历每一个可以到达的点，在这点出发，判断能不能超过 `max_arrive`，如果能，则更新 `max_arrive`。

最后判断 `max_arrive >= len(nums)-1`，判定成功，说明可以到达最后一个位置。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def canJump(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        max_arrive = 0  # 当前能到达的最远距离
        for i, step in enumerate(nums):
            if i <= max_arrive:  # 判断当前点是否可达
                this_arrive = i + step
                if this_arrive > max_arrive:  # 从这点出发，看能不能超过max_arrive
                    max_arrive = this_arrive
        return max_arrive >= len(nums) - 1
```
