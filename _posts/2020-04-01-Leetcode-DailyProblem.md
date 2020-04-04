---
layout: post
title: "Leetcode 2020-04 每日一题"
subtitle: "Leetcode 每日一题 题解与分析"
date: 2020-04-03 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# Leetcode 2020-04 每日一题

*持续更新中 ...*


## 2020-04-04 接雨水
[Leetcode Link](https://leetcode-cn.com/problems/trapping-rain-water/)  

#### 1. 题目描述
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。  
![rainwatertrap](https://s1.ax1x.com/2020/04/04/GwXasf.png)
上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

示例:
```
输入: [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6
```

#### 2. 题解与分析
这道题的解题思路是：
- 每个柱子维护两个状态：`is_drown`和`water_height`，其中`is_drown`是`bool`值，用于判定这个柱子有没有被淹没，初始值为`False`；`water_height`是这个柱子被水淹没后的总高度，初始值为`0`。
- 对每一个没有被淹没的柱子，以该柱子`now`的高度`now_height`，分别向左和向右进行淹没，被淹没的柱子置`is_drown=True`，`water_height=now_height`。
- 最后计算`water_height`与`height`的差值，就是雨水的数量。

则关键在于怎样向左和向右淹没呢？以向左为例（向右类似），我采取的方式是：
- 初始化淹没的左边界`left=now`，向左遍历
- 若遇到比`now_height`低的柱子，则继续向左
- 若遇到与`now_height`相同的柱子`this`，则记录`left=this`，继续向左
- 若遇到比`now_height`高的柱子`this`，因为这个柱子不能被淹没，则记录`left=this+1`，停止遍历
- 将`left->now`的柱子全部置`is_drown=True`，`water_height=now_height`。

#### 3. 代码
本题的 `Python` 代码如下：
```python
class Solution(object):
    def trap(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        is_drown = [False] * len(height)  # if True: this column is drown out
        water_height = [0] * len(height)  # the total height after been drown out
        for now in range(len(height)):
            if not is_drown[now]:  # if been drown out, this column will not be considered
                left = now
                right = now
                for l in range(now)[::-1]:  # flood left
                    if height[l] > height[now]:
                        left = l + 1
                        break
                    elif height[l] == height[now]:
                        left = l
                for r in range(now+1, len(height)):  # flood right
                    if height[r] > height[now]:
                        right = r - 1
                        break
                    elif height[r] == height[now]:
                        right = r
                for i in range(left, right+1):
                    is_drown[i] = True
                    water_height[i] = height[now]
        num_right = 0
        for h, w in zip(height, water_height):  # calcuate the water number
            num_right += w-h
        return num_right
```


## 2020-04-03 字符串转换整数 (atoi)
[Leetcode Link](https://leetcode-cn.com/problems/string-to-integer-atoi/)

由于这个题目的题解与分析比较长，而且比较有代表性，所以放在了单独的 [Blog](https://baihaoran.xyz/2020/04/03/string-to-integer-atoi.html) 中。


## 2020-04-02 生命游戏
[Leetcode Link](https://leetcode-cn.com/problems/game-of-life/)  

#### 1. 题目描述
根据[百度百科](https://baike.baidu.com/item/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F/2926434?fr=aladdin)，生命游戏，简称为生命，是英国数学家约翰·何顿·康威在 1970 年发明的细胞自动机。

给定一个包含 m × n 个格子的面板，每一个格子都可以看成是一个细胞。每个细胞都具有一个初始状态：1 即为活细胞（live），或 0 即为死细胞（dead）。每个细胞与其八个相邻位置（水平，垂直，对角线）的细胞都遵循以下四条生存定律：
- 如果活细胞周围八个位置的活细胞数少于两个，则该位置活细胞死亡；
- 如果活细胞周围八个位置有两个或三个活细胞，则该位置活细胞仍然存活；
- 如果活细胞周围八个位置有超过三个活细胞，则该位置活细胞死亡；
- 如果死细胞周围正好有三个活细胞，则该位置死细胞复活；

根据当前状态，写一个函数来计算面板上所有细胞的下一个（一次更新后的）状态。下一个状态是通过将上述规则同时应用于当前状态下的每个细胞所形成的，其中细胞的出生和死亡是**同时发生**的。

示例：
```
输入：
[[0,1,0],
 [0,0,1],
 [1,1,1],
 [0,0,0]]
输出：
[[0,0,0],
 [1,0,1],
 [0,1,1],
 [0,1,0]]
```

#### 2. 题解与分析
这题的思路很简单：
- 对于一个细胞，统计这细胞周围8个相邻细胞中活细胞的个数`aliveNum`
- 如果`aliveNum=3`，则这个细胞下一个阶段肯定是活的
- 如果`aliveNum<2 or aliveNum>3`，则这个细胞下一个阶段肯定是死的
- 其他情况，维持当前状态不变

则这个问题的关键有两点：
- 边界细胞怎么处理
- 怎么统计细胞周围活细胞的个数`aliveNum`

首先是处理边界细胞，由于边界细胞不同于中间细胞固定有8个相邻细胞，所以处理方式上需要特别注意。为了能让边界细胞与中间细胞统一进行处理，我在面板四周都 padding 一个死细胞(值为0)。这样在统计活细胞时，边界细胞就不需要特别注意了。

再者就是如何统计周围活细胞的个数，*对于这种在二维数组中每个元素进行相邻元素统计类的操作，都可以用 __卷积__ 来实现*。如此题可用用下面的`kernel`来进行卷积操作：
```
kernel = [[1,1,1],
          [1,0,1],
          [1,1,1]]
```
但这题的kernel尺寸比较小，所以可以用一个简单的循环判断来实现。

#### 3. 代码
本题的 `Python` 代码如下：
```python
class Solution(object):
    def gameOfLife(self, board):
        """
        :type board: List[List[int]]
        :rtype: None Do not return anything, modify board in-place instead.
        """

        # get the size of board, and make sure that the board is not empty
        M = len(board)
        if M < 1:
            return
        N = len(board[0])
        if N < 1:
            return

        # a buffer board that is padding with zero
        buff_board = [[0]*(N+2) for _ in range((M+2))]
        for i in range(M+2):
            for j in range(N+2):
                if i!=0 and i!=M+1 and j!=0 and j!=N+1:
                    buff_board[i][j] = board[i-1][j-1]

        for i in range(M):
            for j in range(N):
                sum = 0  # count the number of surrounding alive cells
                for k in range(3):
                    for z in range(3):
                        if k!=1 or z!=1:
                            sum += buff_board[i+k][j+z]
                if sum==3:
                    board[i][j] = 1  # aliveNum=3, the cell will be alive
                elif sum<2 or sum>3:
                    board[i][j] = 0  # aliveNum<2 or aliveNum>3, the cell will be dead
```


## 2020-04-01 有效括号的嵌套深度
[Leetcode Link](https://leetcode-cn.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/)  

#### 1. 题目描述
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

#### 2. 题解与分析
这题的思路很简单：
- 计算「有效括号字符串」`seq`的深度，然后除以2向上取整，得到分解后`A`和`B`的最大深度`maxDepth`。
- 分析「有效括号字符串」`seq`，将深度小于`maxDepth`的部分归于`A`，大于`maxDepth`的部分归于`B`即可。  

则关键在于如何区分深度小于或大于`maxDepth`，此时需要维护一个栈`Stack`，遍历`seq`时：
- 遇到`'('`时，先入栈，栈`Stack`的深度就是**当前括号**的深度
- 遇到`')'`时，栈`Stack`的深度就是**当前括号**的深度，再出栈

#### 3. 代码
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
