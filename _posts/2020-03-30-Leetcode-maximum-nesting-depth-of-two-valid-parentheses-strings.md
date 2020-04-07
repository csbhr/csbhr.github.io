---
layout: post
title: "有效括号的嵌套深度"
subtitle: "Leetcode 2020-04-01 每日一题"
date: 2020-03-30 22:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 有效括号的嵌套深度 [[Link]](https://leetcode-cn.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
有效括号字符串定义：对于每个左括号，都能找到与之对应的右括号，反之亦然。  
嵌套深度 depth 定义：即有效括号字符串嵌套的层数，depth(A) 表示有效括号字符串 A 的嵌套深度。  

给你一个「有效括号字符串」 `seq`，请你将其分成两个不相交的有效括号字符串，`A` 和 `B`，并使这两个字符串的深度最小。  
- 不相交：每个 `seq[i]` 只能分给 `A` 和 `B` 二者中的一个，不能既属于 `A` 也属于 `B` 。
- `A` 或 `B` 中的元素在原字符串中可以不连续。
- `A.length + B.length = seq.length`
- 深度最小：`max(depth(A), depth(B))` 的可能取值最小。

划分方案用一个长度为 `seq.length` 的答案数组 `answer` 表示，编码规则如下：
- `answer[i] = 0`，`seq[i]` 分给 `A` 。
- `answer[i] = 1`，`seq[i]` 分给 `B` 。  

如果存在多个满足要求的答案，只需返回其中任意 **一个** 即可。  
示例：
```
输入：seq = "()(())()"
输出：[0,0,0,1,1,0,1,1]
解释：本示例答案不唯一。
按此输出 A = "()()", B = "()()", max(depth(A), depth(B)) = 1，它们的深度最小。
像 [1,1,1,0,0,1,1,1]，也是正确结果，其中 A = "()()()", B = "()", max(depth(A), depth(B)) = 1 。
```
提示：
- `1 < seq.size <= 10000`  

## 2. 题解与分析
这题的思路很简单：
- 计算「有效括号字符串」`seq`的深度，然后除以2向上取整，得到分解后`A`和`B`的最大深度`maxDepth`。
- 分析「有效括号字符串」`seq`，将深度小于`maxDepth`的部分归于`A`，大于`maxDepth`的部分归于`B`即可。  

则关键在于如何区分深度小于或大于`maxDepth`，此时需要维护一个栈`Stack`，遍历`seq`时：
- 遇到`'('`时，先入栈，栈`Stack`的深度就是**当前括号**的深度
- 遇到`')'`时，栈`Stack`的深度就是**当前括号**的深度，再出栈

## 3. 代码
本题的 `Python` 代码如下：
```python
class Solution(object):

    def calcDepth(self, seq):
        St_top = 0  # init stack
        depth = 0
        for s in seq:
            if s == "(":
                St_top += 1  # push
            elif s == ")":
                St_top -= 1  # pop
            depth = max(depth, St_top)
        return depth

    def maxDepthAfterSplit(self, seq):
        """
        :type seq: str
        :rtype: List[int]
        """
        maxDepth = (self.calcDepth(seq) + 1)//2  # calc the max depth of sub seq
        St_top = 0  # init stack
        class_idx = []
        for s in seq:
            if s == "(":
                St_top += 1  # push
                class_idx.append(0 if St_top <= maxDepth else 1) # shallower=0, deeper=1
            elif s == ")":
                class_idx.append(0 if St_top <= maxDepth else 1)
                St_top -= 1  # pop
        return class_idx
```
