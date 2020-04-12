---
layout: post
title: "鸡蛋掉落"
subtitle: "Leetcode 2020-04-11 每日一题"
date: 2020-04-10 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 鸡蛋掉落 [[Link]](https://leetcode-cn.com/problems/super-egg-drop/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
你将获得 `K` 个鸡蛋，并可以使用一栋从 `1` 到 `N`  共有 `N` 层楼的建筑。

每个蛋的功能都是一样的，如果一个蛋碎了，你就不能再把它掉下去。

你知道存在楼层 `F` ，满足 `0 <= F <= N` 任何从高于 `F` 的楼层落下的鸡蛋都会碎，从 `F` 楼层或比它低的楼层落下的鸡蛋都不会破。

每次移动，你可以取一个鸡蛋（如果你有完整的鸡蛋）并把它从任一楼层 `X` 扔下（满足 `1 <= X <= N`）。

你的目标是确切地知道 `F` 的值是多少。

无论 `F` 的初始值如何，你确定 `F` 的值的最小移动次数是多少？

提示：
- `1 <= K <= 100`
- `1 <= N <= 10000`

示例 1：
```
输入：K = 1, N = 2
输出：2
解释：
鸡蛋从 1 楼掉落。如果它碎了，我们肯定知道 F = 0 。
否则，鸡蛋从 2 楼掉落。如果它碎了，我们肯定知道 F = 1 。
如果它没碎，那么我们肯定知道 F = 2 。
因此，在最坏的情况下我们需要移动 2 次以确定 F 是多少。
```

示例 2：
```
输入：K = 2, N = 6
输出：3
```

示例 3：
```
输入：K = 3, N = 14
输出：4
```

## 题解一

### 题解与思路
题解一参考了 Bilibili [@李永乐老师官方](https://space.bilibili.com/9458053?from=search&seid=1708918051013983301) 的一期视频 [双蛋问题](https://www.bilibili.com/video/BV1KE41137PK)，李老师讲解的非常细致，很值得学习。

我下面整理一下主要思路，采用的是 **动态规划** 的算法，定义 “$K$个鸡蛋，$N$层楼” 的解为 $F(K,N)$, 考虑最小子问题：
- 当 $N=1$ 时，一层楼，只要试一次，$F(K, 1)=1$
- 当 $K=1$ 时，只有一个鸡蛋，只能从一楼开始一层层试，$F(1, N)=N$

再考虑状态转移方程，对于问题 $F(K,N)$，考虑：
- 在 $1~N$ 层中间某层 $t$ 层去丢鸡蛋尝试，有两种情况：
  - 鸡蛋碎了，那要到 $1~t-1$ 层去尝试，问题转换为 $F(K-1,t-1)$
  - 鸡蛋没碎，那要到 $t+1~N$ 层去尝试，问题转换为 $F(K,N-t)$
- 那如何确定 $t$ 呢，只需要让 $t$ 在 $1~N$ 遍历，取最小的即可，所以状态转移方程为：$F(K,N)=1 + \min_{1\leqslant t \leqslant N}(max(F(K-1,t-1),F(K,N-t)))$

考虑到 $F(K,N)$ 是个关于 $N$ 的单调递增函数，也就是说在鸡蛋数 $K$ 固定的情况下，楼层数 $N$ 越多，需要的步数一定不会变少。而在状态转移方程中，$F(K-1,t-1)$ 是关于 $t$ 的单调递增函数，$F(K,N-t)$ 是关于 $t$ 的单调递减函数。我们要找的点是它们的最大值的最小点，如下图的红点（T1代表$F(K-1,t-1)$，T2代表$F(K,N-t)$）：  
![二分法示意图](https://s1.ax1x.com/2020/04/12/GOxnY9.png)

为了找到这个红点，可以采用二分法来找，当 `mid` 点 $F(K-1,mid-1)>F(K,N-mid)$ 时，向左找，否则向右找。

这个算法，时间复杂度为 $O(KNlogN)$，但还是运行超时了。

### 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def superEggDrop(self, K, N):
        """
        :type K: int
        :type N: int
        :rtype: int
        """
        res = [[0 for _ in range(K+1)] for _ in range(N+1)]
        for i in range(1, K+1):
            res[1][i] = 1
        for i in range(1, N+1):
            res[i][1] = i

        for i in range(2, N+1):
            for j in range(2, K+1):
                left, right = 1, i
                while left < right:
                    mid = (left + right + 1) // 2
                    n_break = res[mid-1][j-1]
                    n_unbreak = res[i-mid][j]
                    if n_break > n_unbreak:
                        right = mid - 1
                    else:
                        left = mid
                res[i][j] = max(res[left-1][j-1], res[i-left][j]) + 1

        return res[-1][-1]
```


## 题解二

### 题解与思路
题解二的方法很不常见，我参考了 [官方的题解](https://leetcode-cn.com/problems/super-egg-drop/solution/ji-dan-diao-luo-by-leetcode-solution/) 的方法三。

### 代码
本解法 `Python` 代码如下
```python
class Solution(object):
    def superEggDrop(self, K, N):
        """
        :type K: int
        :type N: int
        :rtype: int
        """
        dp = [[0] * (K + 1) for _ in range(N + 1)]
        for i in range(1, N + 1):
            for j in range(1, K + 1):
                dp[i][j] = dp[i - 1][j] + dp[i - 1][j - 1] + 1
            if dp[i][K] >= N:
                return i
```
