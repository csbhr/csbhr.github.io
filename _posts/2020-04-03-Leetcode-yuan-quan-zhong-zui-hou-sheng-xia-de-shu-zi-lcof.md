---
layout: post
title: "圆圈中最后剩下的数字"
subtitle: "Leetcode 面试题"
date: 2020-04-03 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 约瑟夫问题
---

# 圆圈中最后剩下的数字 [[Link]](https://leetcode-cn.com/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
0, 1, ..., n-1 这 n 个数字排成一个圆圈，从数字 0 开始，每次从这个圆圈里删除第 m 个数字。求出这个圆圈里剩下的最后一个数字。

例如，0、1、2、3、4 这 5 个数字组成一个圆圈，从数字 0 开始每次删除第 3 个数字，则删除的前4个数字依次是 2、0、4、1，因此最后剩下的数字是 3 。

限制：
- $1 <= n <= 10^5$
- $1 <= m <= 10^6$

示例 1:
```
输入: n = 5, m = 3
输出: 3
```
示例 2:
```
输入: n = 10, m = 17
输出: 2
```

## 2. 题解与思路
这是一个典型的 [约瑟夫问题](https://baike.baidu.com/item/%E7%BA%A6%E7%91%9F%E5%A4%AB%E9%97%AE%E9%A2%98/3857719?fr=aladdin) ：N个人围成一圈，第一个人从1开始报数，报M的将被杀掉，下一个人接着从1开始报。如此反复，最后剩下一个，求最后的胜利者。

### 解法一：模拟解法（不推荐）
模拟解法就是模拟这个过程，维护一个 幸存者列表`remaining` ，依次报数，当报到 $M$ 时，删去这个元素，然后重新报数，重复这个过程，直到只剩一人。

但这个方法的时间复杂度达到 $O(M*N)$，当 $M$ 和 $N$ 的规模很大的话，这个算法很难在短时间内完成。

本解法 `Python` 代码如下
```python
class Solution(object):
    def lastRemaining(self, n, m):
        """
        :type n: int
        :type m: int
        :rtype: int
        """
        now = 0
        remaining = list(range(n))
        for i in range(n-1):
            now = (now+m-1) % len(remaining)
            remaining.pop(now)
        return remaining[0]
```


### 解法二：递归公式（推荐）
首先模拟一下这个过程，在 n 个数中，每次删除第 m 个数，记为 $F(n, m)$ ：  
现在有 n 个数 $[0, 1, 2, ..., n-1]$, 从 $0$ 开始报数，报到 $m-1$ 时（第m个数）时，删除该元素，然后在 n-1 个数中，每次删除第 m 个数，即退化为子问题 $F(n-1, m)$ 。

那么 $F(n, m)$ 与 $F(n-1, m)$ 之间存在什么关系呢？

假设 $F(n-1, m)=x$，那么这个编号 $x$ 在问题 $F(n, m)$ 的原来的编号是多少呢？而这个 $x$ 的原来的编号 $y$ 就是 $F(n, m)$ 的解。  

在上面的模拟过程中，去除的第一个数的编号为 $m-1$ ，那剩下的 n-1 个数为 $[0, 1, ..., m-2, m, ..., n-1]$ ，在解下一个子问题 $F(n-1, m)$ 时，对这个 n-1 个数重新编号，即 $[n-m, n-m+1, ..., n-2, 0, ..., n-m-1]$ 。  
对应起来可以发现，原编号 $y$ 重新编号 $x$ 后，有这样的对应关系：$y=(x+m)%n$。则可以得到下面的 **递推公式** ：
$$F(n, m)=(F(n-1, m)+m)%n$$

可知当只有一个数字时，编号 $0$ 就是结果，即 $F(1, m)=0$ ，这样我们就可以根据这个递推公式来反推得到结果，这个时间复杂度便降到了 $O(N)$ 。

本解法 `Python` 代码如下
```python
class Solution(object):
    def lastRemaining(self, n, m):
        """
        :type n: int
        :type m: int
        :rtype: int
        """
        survived_id = 0
        for i in range(1, n+1):
            survived_id = (survived_id + m) % i
        return survived_id
```
