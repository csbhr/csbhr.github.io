---
layout: post
title: "统计「优美子数组」"
subtitle: "Leetcode 2020-04-21 每日一题"
date: 2020-04-20 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 统计「优美子数组」 [[Link]](https://leetcode-cn.com/problems/count-number-of-nice-subarrays/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给你一个整数数组 `nums` 和一个整数 `k`。

如果某个 **连续** 子数组中恰好有 `k` 个奇数数字，我们就认为这个子数组是「优美子数组」。

请返回这个数组中「优美子数组」的数目。

提示：
- `1 <= nums.length <= 50000`
- `1 <= nums[i] <= 10^5`
- `1 <= k <= nums.length`

示例 1：
```
输入：nums = [1,1,2,1,1], k = 3
输出：2
解释：包含 3 个奇数的子数组是 [1,1,2,1] 和 [1,2,1,1] 。
```

示例 2：
```
输入：nums = [2,4,6], k = 1
输出：0
解释：数列中不包含任何奇数，所以不存在优美子数组。
```

示例 3：
```
输入：nums = [2,2,2,1,2,2,1,2,2,2], k = 2
输出：16
```

## 2. 题解与分析
解决本题的思路是：「优美子数组」可以由相邻 `k` 个奇数来生成，这 `k` 个奇数左右两侧的偶数是可选的，即：左边有 `n` 个偶数，右边有 `m` 个偶数，那么这 `k` 个奇数可以产生 `(n+1)*(m+1)`个「优美子数组」。

以 示例3 为例：`nums` 中奇数下标为 `[3, 6]`，这 `k=2` 个奇数左边有 `3` 个偶数，右边有 `3` 个偶数，那么左边可选择加入 `['2', '22', '222','']` 共 `4` 种选择，同样右边也有 `4` 种选择，则一共可以产生 `4*4=16` 个「优美子数组」。

具体的思路是：
- 首先，记录数组 `nums` 中奇数的下标 `odd_idx`
- 采用窗口大小为 `k` 的滑动窗口对 `odd_idx` 进行分析：
  - 记录窗口左边界到左边第一个奇数之间存在多少个偶数 `n`
  - 记录窗口右边界到右边第一个奇数之间存在多少个偶数 `m`
  - 这个窗口就可以产生 `(n+1)*(m+1)` 个「优美子数组」

注：为了方便处理边界，可以在 `odd_idx` 开头和结尾加上 `-1` 和 `len(nums)`。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def numberOfSubarrays(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: int
        """
        odd_idx = [-1]  # 为了方便处理边界，在开头加上 -1
        for i in range(len(nums)):  # 记录奇数下标
            if nums[i] % 2 != 0:
                odd_idx.append(i)
        odd_idx.append(len(nums))  # 为了方便处理边界，结尾加上 len(nums)

        res = 0
        for i in range(len(odd_idx))[1:-k]:
            pre_odd = odd_idx[i - 1]
            border_l = odd_idx[i]
            border_r = odd_idx[i + k - 1]
            next_odd = odd_idx[i + k]
            optional_l = border_l - pre_odd  # 记录左边的偶数，已经 +1
            optional_r = next_odd - border_r  # 记录右边的偶数，已经 +1
            res += optional_l * optional_r  # 可以产生的「优美子数组」个数

        return res
```
