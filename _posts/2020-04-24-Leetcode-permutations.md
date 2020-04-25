---
layout: post
title: "全排列"
subtitle: "Leetcode算法题 46"
date: 2020-04-24 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 回溯法
---

# 全排列 [[Link]](https://leetcode-cn.com/problems/permutations/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定一个 没有重复 数字的序列，返回其所有可能的全排列。

示例：
```
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

## 2. 题解与分析
本题是要找出全排列的所有的情况，是典型的 **回溯法** 的题目。

回溯法是通过探索所有可能的候选解来找出所有的解的算法，如果得到的候选解不是最后一个解（或不是解），则算法则记录这个解（或抛弃这个解），回溯到上一步继续尝试。

对于此题，则是从给定的 nums 中，不断地选取数字来从左到右填充序列，当所有的数字都被选择了，则这个序列就是一个解。当得到一个解后，记录这个解，然后回溯到上一步，继续尝试其他的选择。以 示例 为例，搜索的树状图如下：

![示例搜索树状图](https://s1.ax1x.com/2020/04/25/JsJjMj.png)

注意：要考虑实现过程中 **深浅拷贝** 问题，要保证回溯时可以恢复现场。


## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def func(self, now_nums, residual_nums, results):
        """
        now_nums：当前已选择的序列
        residual_nums：当前还剩余可供选择的数字
        results：用于记录解
        """
        if len(residual_nums) <= 1:  # 当只有一个数字可选时，选中后边记录解，然后回溯
            now_nums.extend(residual_nums)
            results.append(now_nums)
            return
        for rn in residual_nums:
            copy_now_nums = [i for i in now_nums]  # 考虑深浅拷贝，保证回溯时可以恢复现场
            copy_residual_nums = [i for i in residual_nums]
            copy_now_nums.append(rn)  # 选中一个数字
            copy_residual_nums.remove(rn)  # 把这个数字从可供选择中剔除，供下面的尝试使用
            self.func(copy_now_nums, copy_residual_nums, results)  # 继续往下尝试

    def permute(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        results = []
        self.func([], nums, results)
        return results
```
