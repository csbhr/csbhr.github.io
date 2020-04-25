---
layout: post
title: "硬币"
subtitle: "Leetcode算法题 面试题08.11"
date: 2020-04-22 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 动态规划
    - 背包问题
---

# 硬币 [[Link]](https://leetcode-cn.com/problems/coin-lcci/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
硬币。给定数量不限的硬币，币值为25分、10分、5分和1分，编写代码计算n分有几种表示法。(结果可能会很大，你需要将结果模上1000000007)

说明：
- `0 <= n (总金额) <= 1000000`

示例 1：
```
输入: n = 5
输出：2
解释: 有两种方式可以凑成总金额:
5=5
5=1+1+1+1+1
```

示例 2：
```
输入: n = 10
输出：4
解释: 有四种方式可以凑成总金额:
10=10
10=5+5
10=5+1+1+1+1+1
10=1+1+1+1+1+1+1+1+1+1
```

## 2. 题解与分析
这题是两个经典的 **背包类型问题** 的组合：完全背包问题、背包方案数问题。需要使用 **动态规划** 的算法解决。

最核心的点在于如何推导出 **状态转移方程**。有硬币类型 `coins = [1, 5, 10, 25]`，设 `dp[i][n]` 代表前 `i` 种硬币构成面值 `n` 的方案个数，即推导出 `dp[i][n]` 的表达式。

此时，我们可以通过考虑 “使用几枚第 `i` 种硬币” 的思路来得到 `dp[i][n]` 的表达式。关于第 `i` 中硬币，该硬币面值为 `$c_i$=coins[i]`，且该硬币个数的选择有这个几种：`0, 1, ..., k`，其中 `$k=\lfloor \frac{n}{c_i} \rfloor$`。根据选择使用几枚第 `i` 种硬币，将这些情况的方案个数加起来就得到了 `dp[i][n]`，则可以推导出：

$$dp[i][n]=\sum_{j=0}^k dp[i-1][n-k*c_i], k=\lfloor \frac{n}{c_i} \rfloor$$

此时，想要填满状态表，需要三层循环，为了减少时间复杂度，我们可以继续做一些推导：

把 `dp[i][n]` 的表达式展开，得到：

$$dp[i][n]=dp[i-1][n]+dp[i-1][n-c_i]+dp[i-1][n-2*c_i]+...+dp[i-1][n-k*c_i]$$

再考虑 `dp[i][n-&c_i&]`：

$$dp[i][n-c_i]=dp[i-1][n-c_i]+dp[i-1][n-2*c_i]+...+dp[i-1][n-k*c_i]$$

此时发现：

$$dp[i][n]=dp[i-1][n]+dp[i][n-c_i]$$

这样，填满状态表，只需要两层循环即可。

注：在寻找 `dp[i][n-$c_i$]` 时，可能出现 `n-$c_i$<0` 的情况，此时是面值 `n` 比第 `i` 种硬币的面值小，则取 `dp[i][n-$c_i$]=0` 即可。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def waysToChange(self, n):
        """
        :type n: int
        :rtype: int
        """
        coins = [1, 5, 10, 25]

        dp = [[1 for _ in range(n+1)] for _ in range(4)]  # 状态表

        for i in range(1, 4):  # 当只使用 1 元硬币时，只有一种方案
            for j in range(5, n+1):  # 由于 1 元硬币后就是 5 元，则面值 0-4 元就只有一种方案
                dp[i][j] = dp[i-1][j] + (dp[i][j-coins[i]] if j-coins[i]>=0 else 0)  # 计算状态方程，当前面值小于硬币面值时，取 0

        return dp[3][n] % 1000000007
```
