---
layout: post
title: "括号生成"
subtitle: "Leetcode算法题 22"
date: 2020-04-08 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 递归
---

# 括号生成 [[Link]](https://leetcode-cn.com/problems/generate-parentheses/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给出 `n` 代表生成括号的对数，请你写出一个函数，使其能够生成所有可能的并且有效的括号组合。

例如，给出 `n = 3`，生成结果为：
```
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```

## 2. 题解与思路
本题可以使用 **递归** 来做，记录递归状态：已生成的字符 `now_str`，左括号个数 `n_left`，右括号个数 `n_right`，最大括号对数 `n`，进行以下递归：
- 若 `now_str` 长度已经达到了 `2*n`，说明括号长度已经够了，存储起来，跳出递归
- 若 `n_left < n`，说明括号对数还没有达到最大，允许继续添加左括号，添加一个左括号后，继续递归
- 若 `n_right < n_left`，说明左括号还有配对富余，允许继续添加右括号，添加一个右括号后，继续递归

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def get_str(self, now_str, n_left, n_right, n):
        if len(now_str) >= 2*n:  # the number of pairs is satisfied
            self.str_list.append(now_str)
            return
        if n_left < n:  # allow to adding the left parenthesis
            self.get_str(now_str+'(', n_left+1, n_right, n)
        if n_right < n_left:  # allow to adding the right parenthesis
            self.get_str(now_str+')', n_left, n_right+1, n)


    def generateParenthesis(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        self.str_list = []
        self.get_str('', 0, 0, n)
        return self.str_list
```
