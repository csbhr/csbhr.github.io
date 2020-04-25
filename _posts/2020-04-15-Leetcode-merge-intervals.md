---
layout: post
title: "合并区间"
subtitle: "Leetcode算法题 56"
date: 2020-04-15 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 合并区间 [[Link]](https://leetcode-cn.com/problems/merge-intervals/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
给出一个区间的集合，请合并所有重叠的区间。

示例 1：
```
输入: [[1,3],[2,6],[8,10],[15,18]]
输出: [[1,6],[8,10],[15,18]]
解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
```

示例 2：
```
输入: [[1,4],[4,5]]
输出: [[1,5]]
解释: 区间 [1,4] 和 [4,5] 可被视为重叠区间。
```

## 2. 题解与思路
这题我采用类似于 **插入排序** 的思路：将输入的列表分为两个部分（“有序部分”、“无序部分”），开始时“有序部分”为空，“无序部分”为输入列表；把“无序部分”的元素依次插入“有序部分”中，当“无序部分”为空时，“有序部分”就是排序好的列表。

因为这题的操作会导致列表元素个数的变化，不能单纯的把输入列表分为两部分，而是维护一个 **合并列表 `combined`** 来用来存储完成操作的元素，依次把输入列表 `intervals` 中的元素插入到 `combined` 中并完成合并操作。

每次向 `combined` 中插入元素时，都要保证：
- `combined` 中每个元素代表的区间之间不能有重叠
- `combined` 中每个元素代表的区间按顺序排列，即是有序的

这样重点就在于如何正确地向 `combined` 中插入元素，并能满足上面两个条件。对于插入元素 `new` 都进行以下操作：
- 遍历 `combined` 中的元素 `combined[i]`，判断以下情形：
  - 如果区间 `combined[i]` 与 `new` 重叠，则把 `new` 并入 `combined[i]` 中。由于 `combined[i]` 区间有变化，需要检测周围区间是否出现重叠，由于 `combined` 列表是有序的，所以重叠区域只能出现在右侧，则向右遍历，合并重叠区间。完成合并操作后跳出遍历。
  - 如果 `new` 的区间上界已经小于了 `combined[i]` 的下界，由于 `combined` 列表是有序的，说明 `combined` 中没有与 `new` 重叠的区间，则把 `new` 插入到 `combined` 的合适位置（就是 `i` 位置）。跳出遍历。
- 当遍历完 `combined` 后，`new` 依然没有插入到合适位置，说明 `combined` 的区间都小于 `new`，那就把它放在 `combined` 最后。

对输入列表 `intervals` 中每个区间都依次插入 `combined` 后，区间的合并任务就完成了。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def add_inter(self, master, new):
        i = 0
        while i < len(master):
            if max(new[0], master[i][0]) <= min(new[1], master[i][1]):  # 出现重叠区间
                master[i] = [min(new[0], master[i][0]), max(new[1], master[i][1])]
                right = master[i][1]
                to_remove = []
                for mj in master[i + 1:]:  # 向右检测并合并重叠区间
                    if right >= mj[0]:
                        right = max(right, mj[1])
                        to_remove.append(mj)
                    else:
                        break
                master[i][1] = right
                for r in to_remove:
                    master.remove(r)
                break
            elif new[1] < master[i][0]:  # 无重叠区间，把 new 插入到合适位置，即 i 位置
                master.insert(i, new)
                break
            i += 1
        if i == len(master):  # 遍历完还没有被插入，则放在最后
            master.append(new)

    def merge(self, intervals):
        """
        :type intervals: List[List[int]]
        :rtype: List[List[int]]
        """
        combined = []
        for inter in intervals:
            self.add_inter(combined, inter)  # 依次向 combined 插入区间
        return combined
```
