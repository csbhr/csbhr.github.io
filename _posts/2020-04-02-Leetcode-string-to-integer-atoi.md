---
layout: post
title: "字符串转换整数 (atoi)"
subtitle: "Leetcode算法题 8"
date: 2020-04-02 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
    - 确定有限状态机
---

# 字符串转换整数 (atoi) [[Link]](https://leetcode-cn.com/problems/string-to-integer-atoi/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
请你来实现一个 `atoi` 函数，使其能将字符串转换成整数。  
首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。接下来的转化规则如下：
- 如果第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字字符组合起来，形成一个有符号整数。
- 假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成一个整数。
- 该字符串在有效的整数部分之后也可能会存在多余的字符，那么这些字符可以被忽略，它们对函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换，即无法进行有效转换。  
在任何情况下，若函数不能进行有效的转换时，请返回 0 。  
提示：
- 本题中的空白字符只包括空格字符 ' ' 。
- 假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 $[−2^{31},  2^{31} − 1]$。如果数值超过

这个范围，请返回 $INT_{MAX} (2^{31} − 1)$ 或 $INT_{MIN} (−2^{31})$ 。  
示例 1:
```
输入: "42"
输出: 42
```

示例 2:
```
输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
```
示例 3:
```
输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
```
示例 4:
```
输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。因此无法执行有效的转换。
```
示例 5:
```
输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。因此返回 INT_MIN (−231) 。
```

## 2. 解法一：按题意流程分析字符串（不推荐）

### 2.1 分析
分析本题的题意，可以提炼出处理字符串的流程是：
1. 去除开头的空格字符
2. 对第一个字符 `firstChar` 进行判断：
  - 如果 `firstChar` 是 `+/-`，则去掉这个字符并记录符号，进入步骤3
  - 如果 `firstChar` 是数字，则直接进入步骤3
  - 其他情况，返回 0
3. 依次查找后面尽可能多的连续数字字符
4. 转换成 `int` 类型，并判断越界情况

### 2.2 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def myAtoi(self, str):
        """
        :type str: str
        :rtype: int
        """

        for i in range(len(str)):  # remove pre space
            if str[i] != ' ':
                str = str[i:]
                break

        if len(str) <= 0:
            return 0

        flag = True  # positive:True, negative:False
        if str[0] == '+':
            str = str[1:]
        elif str[0] == '-':
            str = str[1:]
            flag = False
        elif not str[0].isdigit():
            return 0

        for i in range(len(str)):  # select consequent numbers
            if not str[i].isdigit():
                str = str[:i]
                break

        if len(str) <= 0:
            return 0

        # handle the sign and out of bound
        result = min(2**31-1, int(str)) if flag else max(-2**31, -int(str))

        return result
```


## 3. 解法二：确定有限状态机（推荐）

### 3.1 分析
如果按 解法一 直接上手处理字符串，不仅分析流程比较繁琐，要考虑各种情况，而且用循环判断的方式，非常容易出现臃肿糟糕的代码，难以解读和分析。  
*随然这个题目还没有到达臃肿的程度，但依然不推荐直接上手处理字符串。*  

使用 **“确定有限状态机”** 来分析处理字符串处理流程，可以避免臃肿的代码。  
我们可以将处理字符串的过程看做一个状态机，这个状态机的每个时刻都有一个状态，然后每次根据输入的字符来更换状态。这样只要定义了这个自动机的 **状态** 和 **状态转换的条件** 即可让其自动的处理字符串。  

对于这题，我们可以定义这样几个状态：`['start', 'signed', 'in_number', 'end']`，状态间的转换可以定义如下：

state| " " | +/- | number | others
:-: | :-: | :-: | :-: | :-:
start | start | signed | in_number | end|
signed | end | end | in_number | end|
in_number | end | end | in_number | end|
end | end | end | end | end|

我们只需要把 **状态** 和 **状态转换的条件** 定义成一个 `class` 即可让其自动的处理字符串。


### 3.2 代码
本解法 `Python` 代码如下
```python
class Automaton(object):
    def __init__(self):
        """
        Define the deterministic finite automaton, DFA
        """
        self.states_name, self.now_state = self._init_states()
        self.trigger_table = self._init_trigger_table()

    def _init_states(self):
        """
        initialize the states
        """
        states_name = ['start', 'signed', 'in_number', 'end']
        now_state = 0
        return states_name, now_state

    def _init_trigger_table(self):
        """
        initialize the state transition table
        """
        return [
            [0, 1, 2, 3],
            [3, 3, 2, 3],
            [3, 3, 2, 3],
            [3, 3, 3, 3]
        ]

    def _get_trigger(self, char):
        """
        get the state transition according to input char
        param:
            char: the triggered character
        return:
            col_id: the column's id that been triggered
        """
        if char == " ":
            return 0
        elif char == "+" or char =="-":
            return 1
        elif char.isdigit():
            return 2
        else:
            return 3

    def action(self, seq):
        sign_postive = True
        numbers = ""
        for s in seq:
            triggered_col = self._get_trigger(s)
            self.now_state = self.trigger_table[self.now_state][triggered_col]  # state transition
            if self.states_name[self.now_state] == 'signed':
                if s == '-':
                    sign_postive = False
            elif self.states_name[self.now_state] == 'in_number':
                numbers = numbers + s
        if len(numbers) > 0:
            return min(2**31-1, int(numbers)) if sign_postive else max(-2**31, -int(numbers))
        else:    
            return 0



class Solution(object):

    def myAtoi(self, str):
        """
        :type str: str
        :rtype: int
        """
        automa = Automaton()
        return automa.action(str)
```
