---
layout: post
title: "两数相加 II"
subtitle: "Leetcode算法题 445"
date: 2020-04-13 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 两数相加 II [[Link]](https://leetcode-cn.com/problems/add-two-numbers-ii/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

**涉及知识点：链表操作**

## 1. 题目描述
给你两个 **非空** 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

进阶：
- 如果输入链表不能修改该如何处理？换句话说，你不能对列表中的节点进行翻转。


示例：
```
输入：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 8 -> 0 -> 7
```

## 2. 题解与思路
算加法，因为涉及到进位，所以一般都是从低位到高位算。而这题的数字是从高位到低位存储的，所以需要翻转过来后再运算。

既然不能对列表中的节点进行翻转，那么我们可以用 **栈** 来实现，计算出来结果后，再把结果翻转回来。

处理过程中需要注意：
- 为了能使用同一的步骤处理，两个数高位不对齐部分用零补齐。
- 要注意处理进位，到最高位时，如果进位不为零，还需增加一个高位节点。
- 为了提高效率，在创建结果链表时，可以采用 **头插法** 创建链表，这样创建出来的链表就已经翻转过了，省去最后的翻转步骤。

## 3. 代码
本解法 `Python` 代码如下
```python
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution(object):
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        S1, S2 = [], []
        while l1:
            S1.append(l1)  # 入栈翻转
            l1 = l1.next
        while l2:
            S2.append(l2)  # 入栈翻转
            l2 = l2.next

        carrier = 0  # 进位
        res_node = None
        while len(S1)>0 or len(S2)>0 or carrier>0:
            tmp1 = S1.pop().val if len(S1)>0 else 0  # 高位用 0 补齐
            tmp2 = S2.pop().val if len(S2)>0 else 0
            summ = tmp1 + tmp2 + carrier
            keeper = summ % 10
            carrier = summ // 10
            new_node = ListNode(keeper)
            new_node.next = res_node
            res_node = new_node  # 使用头插法创建链表

        return res_node
```
