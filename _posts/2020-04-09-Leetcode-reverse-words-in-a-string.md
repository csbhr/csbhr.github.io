---
layout: post
title: "翻转字符串里的单词"
subtitle: "Leetcode 2020-04-10 每日一题"
date: 2020-04-09 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 翻转字符串里的单词 [[Link]](https://leetcode-cn.com/problems/reverse-words-in-a-string/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给定一个字符串，逐个翻转字符串中的每个单词。

说明：
- 无空格字符构成一个单词。
- 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
- 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

示例 1：
```
输入: "the sky is blue"
输出: "blue is sky the"
```

示例 2：
```
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```

示例 3：
```
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```

## 2. 题解与思路
使用 **“确定有限状态机”** 来分析处理字符串处理流程，可以避免臃肿的代码。  
我们可以将分割字符串中单词的过程看做一个状态机，这个状态机的每个时刻都有一个状态，然后每次根据输入的字符来更换状态。这样只要定义了这个自动机的 **状态** 和 **状态转换的条件** 即可让其自动的处理字符串。  

对于这题，我们可以定义这样几个状态：`['start', 'in_word', 'word_done']`，状态间的转换可以定义如下：

state| " " | others
:-: | :-: | :-:
start | start | in_word
in_word | word_done | in_word
word_done | start | in_word

每个状态的操作是：
- `start` ：不做任何操作
- `in_word` ：在 `now_word` 中添加当前字符
- `word_done` ：把 `now_word` 加入到列表 `words` 中，并清空 `now_word`

## 3. 代码
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
        states_name = ['ready', 'in_word', 'word_done']
        now_state = 0
        return states_name, now_state

    def _init_trigger_table(self):
        """
        initialize the state transition table
        """
        return [
            [0, 1],
            [2, 1],
            [0, 1]
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
        else:
            return 1

    def action(self, seq):
        words = []
        now_word = ""
        for s in seq:
            triggered_col = self._get_trigger(s)
            self.now_state = self.trigger_table[self.now_state][triggered_col]  # state transition
            if self.states_name[self.now_state] == 'in_word':
                now_word += s
            elif self.states_name[self.now_state] == 'word_done':
                words.append(now_word)
                now_word = ""
        if len(now_word) > 0:
            words.append(now_word)
        return words

class Solution(object):
    def reverseWords(self, s):
        """
        :type s: str
        :rtype: str
        """
        automa = Automaton()
        words = automa.action(s)
        return " ".join(words[::-1])
```
