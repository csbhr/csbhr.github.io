---
layout: post
title: "数组中的逆序对"
subtitle: "Leetcode算法题 面试题51"
date: 2020-04-23 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 数组中的逆序对 [[Link]](https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

**涉及知识点：分治法、归并排序**

## 1. 题目描述
在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

说明：
- `0 <= 数组长度 <= 50000`

示例：
```
输入: [7,5,6,4]
输出: 5
```

## 2. 题解与分析
看到本题，第一反应应该是用两层循环判断来解答，但是这样的算法的时间复杂度为 $O(n^2)$，对于 `0 <= 数组长度 <= 50000` 的规模，肯定是要超时的。

这里我们可以采用 **分治** 的思想来考虑，考虑下面 **归并排序** 的一种情况：

有两个已排序的序列等待合并，其中 `L={8,12,16,22,100}` 和 `R={9,26,55,64,91}`，一开始我们用指针 `lPtr = 0` 指向 `L` 的首部，`rPtr = 0` 指向 `R` 的头部。记已经合并好的部分为 `M`:
```
L = [8, 12, 16, 22, 100]   R = [9, 26, 55, 64, 91]  M = []
     |                          |
   lPtr                       rPtr
```
我们发现 `lPtr` 指向的元素小于 `rPtr` 指向的元素，于是把 `lPtr` 指向的元素放入答案，并把 `lPtr` 后移一位。
```
L = [8, 12, 16, 22, 100]   R = [9, 26, 55, 64, 91]  M = [8]
        |                       |
      lPtr                     rPtr
```
这个时候我们把左边的 `8` 加入了答案，我们发现右边没有数比 `8` 小，所以 `8` 可以提供的逆序对数为 `0`。

接着我们继续合并，把 `9` 加入了答案，此时 `lPtr` 指向 `12`，`rPtr` 指向 `26`。
```
L = [8, 12, 16, 22, 100]   R = [9, 26, 55, 64, 91]  M = [8, 9]
        |                          |
       lPtr                       rPtr
```
我们发现 `L` 中剩下的数都比 `9` 大，则 `9` 与 `L` 中剩下的数都可以组成逆序对。

**此时可以总结得到：当在归并过程中，只有在 `lPtr` 右移的时候才会产生逆序对，且产生的逆序对的个数是 `L` 中剩下的数的个数。**

这样，我们就可以借助归并排序，利用分治的思想来计算逆序对数。

此题解参考了[官方题解](https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/solution/shu-zu-zhong-de-ni-xu-dui-by-leetcode-solution/)，官方题解还给出了视频讲解，讲解的非常详细，值得学习。

## 3. 代码
本解法 `Python` 代码如下
```python
class Solution(object):

    def mergeSort(self, ori_nums, left, right):
        if left == right:  # 当只有 1 个数的时候，是不需要归并的，逆序对数自然为 0
            return 0

        # 将数组分成两半，分别进行归并排序，同时可以计算子数组的逆序对数
        mid = (left + right) // 2
        count = self.mergeSort(ori_nums, left, mid) + self.mergeSort(ori_nums, mid + 1, right)

        # 有了子数组的逆序对数，此数组还能在归并过程中计算出逆序对数，如题解分析
        merged = []
        l, r = left, mid + 1
        while l <= mid and r <= right:
            if ori_nums[l] <= ori_nums[r]:
                merged.append(ori_nums[l])
                l += 1
            else:
                merged.append(ori_nums[r])  # 右指针右移的时候才能产生逆序对
                r += 1
                count += (mid - l + 1)  # 逆序对的个数是左边数组剩下的数的个数

        # 处理没归并完的子数组，这个过程不产生逆序对
        while l <= mid:
            merged.append(ori_nums[l])
            l += 1
        while r <= right:
            merged.append(ori_nums[r])
            r += 1

        ori_nums[left:right + 1] = merged  # 归并后放回原数组

        return count

    def reversePairs(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if len(nums) <= 0:
            return 0
        count = self.mergeSort(nums, 0, len(nums) - 1)
        return count
```
