---
layout: post
title: "编辑距离"
subtitle: "Leetcode算法题 72"
date: 2020-04-05 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 动态规划
---

# 编辑距离 [[Link]](https://leetcode-cn.com/problems/edit-distance/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数 。

你可以对一个单词进行如下三种操作：
- 插入一个字符
- 删除一个字符
- 替换一个字符

示例 1 :
```
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
```
示例 2 :
```
输入：word1 = "intention", word2 = "execution"
输出：5
解释：
intention -> inention (删除 't')
inention -> enention (将 'i' 替换为 'e')
enention -> exention (将 'n' 替换为 'x')
exention -> exection (将 'n' 替换为 'c')
exection -> execution (插入 'u')
```

## 2. 题解与思路
本题可以采用 **动态规划** 的方法来做。

分析这个问题：  
两个单词 word1 长度为 $m$，word2 长度为 $n$，求转换最少操作数，解为 $F(m, n)$，可以通过下面四种情况转化为子问题:
1. 若 $m=0$，则 $F(m, n) = F(0, n)=n$
2. 若 $n=0$，则 $F(m, n) = F(m, 0)=m$
3. 若 $word1[m]==word2[n]$，此位置字符相同，不需要操作，则 $F(m, n) = F(m-1, n-1)$
4. 若 $word1[m]!=word2[n]$，此位置字符不同，此位置需要一次操作，接下来的子问题有三种，取最小的一种，可得$F(m, n) = min( F(m, n-1), F(m-1, n), F(m-1, n-1) )+1$，这三种操作如下：
  - 在 $word1$ 插入一个字符，即$F(m, n-1)$
  - 在 $word1$ 删除一个字符，即$F(m-1, n)$
  - 在 $word1$ 替换一个字符，即$F(m-1, n-1)$

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def minDistance(self, word1, word2):
        """
        :type word1: str
        :type word2: str
        :rtype: int
        """
        res = [[0 for _ in range(len(word2) + 1)] for _ in range(len(word1) + 1)]
        for i in range(len(word1) + 1):
            for j in range(len(word2) + 1):
                if i == 0:  # case 1
                    res[i][j] = j
                elif j == 0:  # case 2
                    res[i][j] = i
                elif word1[i - 1] == word2[j - 1]:  # case 3
                    res[i][j] = res[i - 1][j - 1]
                else:
                    res[i][j] = min(res[i - 1][j], res[i][j - 1], res[i - 1][j - 1]) + 1    # case 4
        return res[-1][-1]
```
