---
layout: post
title: "设计推特"
subtitle: "Leetcode 2020-04-13 每日一题"
date: 2020-04-12 17:00:00 -0400
catalog: true
background:
tags:
    - Leetcode
---

# 设计推特 [[Link]](https://leetcode-cn.com/problems/design-twitter/)
[Leetcode 4月每日一题合集](https://baihaoran.xyz/2020/04/01/Leetcode-DailyProblemCollection.html)

## 1. 题目描述
设计一个简化版的推特(Twitter)，可以让用户实现发送推文，关注/取消关注其他用户，能够看见关注人（包括自己）的最近十条推文。你的设计需要支持以下的几个功能：
- `postTweet(userId, tweetId)`: 创建一条新的推文
- `getNewsFeed(userId)`: 检索最近的十条推文。每个推文都必须是由此用户关注的人或者是用户自己发出的。推文必须按照时间顺序由最近的开始排序。
- `follow(followerId, followeeId)`: 关注一个用户
- `unfollow(followerId, followeeId)`: 取消关注一个用户


示例：
```
Twitter twitter = new Twitter();

// 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
twitter.postTweet(1, 5);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
twitter.getNewsFeed(1);

// 用户1关注了用户2.
twitter.follow(1, 2);

// 用户2发送了一个新推文 (推文id = 6).
twitter.postTweet(2, 6);

// 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
// 推文id6应当在推文id5之前，因为它是在5之后发送的.
twitter.getNewsFeed(1);

// 用户1取消关注了用户2.
twitter.unfollow(1, 2);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// 因为用户1已经不再关注用户2.
twitter.getNewsFeed(1);
```

## 2. 题解与思路
本题应该考察程序设计的题目，而不是考察算法。**重点在于：怎么有效的存储数据，怎样对数据操作**。

首先是怎么有效的存储数据，这题主要涉及用户的关注、用户的推文，所以我使用两个字典来分别存储用户的关注和推文，同时还要涉及到推文时间的排序，还需要维护一个变量来记录当前时间：
- `self.observed_dict`：存储用户的关注，`key` 是用户id，`value` 是该用户关注的用户id
- `self.tweet_dict`：存储用户的推文，`key` 是用户id，`value` 是该用户的推文，每个推文是一个 `tuple`，`tuple[0]` 为推文id，`tuple[1]` 为推文时间
- `self.time`：当前时间，从 `0` 开始，每 `postTweet` 一次，`self.time += 1`

接下来就是考虑怎样对数据进行操作了，对数据操作时要注意：
- 因为本题的测试用例，并没有保证每个操作中的出现的 `userId` 都已经存在，所以每次都要进行判断，如果不存在，需要把这个用户添加进来。
- 为了能查询推文时，能同时查到自己的和关注用户的推文，初始时，首先要关注自己，并不可以取关自己。
- 查询推文时，获取自己的和关注用户的推文，然后根据推文时间排序，因为是固定查询 10 条推文，可以使用 **冒泡排序**，只需要遍历 10 次即可。

## 3. 代码
本解法 `Python` 代码如下
```python
class Twitter(object):

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.time = 0
        self.observed_dict = {}
        self.tweet_dict = {}

    def add_new_user(self, userId):
        if userId not in self.observed_dict:
            self.observed_dict[userId] = [userId]
            self.tweet_dict[userId] = []


    def postTweet(self, userId, tweetId):
        """
        Compose a new tweet.
        :type userId: int
        :type tweetId: int
        :rtype: None
        """
        self.add_new_user(userId)

        self.tweet_dict[userId].append((tweetId, self.time))
        self.time += 1


    def getNewsFeed(self, userId):
        """
        Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent.
        :type userId: int
        :rtype: List[int]
        """
        self.add_new_user(userId)

        all_related_tweet = []
        for eeid in self.observed_dict[userId]:
            all_related_tweet.extend(self.tweet_dict[eeid])

        for i in range(min(len(all_related_tweet) - 1, 10)):
            for j in range(len(all_related_tweet) - i -1):
                if all_related_tweet[j][1] > all_related_tweet[j+1][1]:
                    tmp = all_related_tweet[j]
                    all_related_tweet[j] = all_related_tweet[j+1]
                    all_related_tweet[j+1] = tmp

        res = [tw[0] for tw in all_related_tweet[::-1][:10]]
        return res


    def follow(self, followerId, followeeId):
        """
        Follower follows a followee. If the operation is invalid, it should be a no-op.
        :type followerId: int
        :type followeeId: int
        :rtype: None
        """
        self.add_new_user(followerId)
        self.add_new_user(followeeId)

        if followeeId not in self.observed_dict[followerId]:
            self.observed_dict[followerId].append(followeeId)


    def unfollow(self, followerId, followeeId):
        """
        Follower unfollows a followee. If the operation is invalid, it should be a no-op.
        :type followerId: int
        :type followeeId: int
        :rtype: None
        """
        self.add_new_user(followerId)
        self.add_new_user(followeeId)

        if followeeId in self.observed_dict[followerId] and followeeId != followerId:
            self.observed_dict[followerId].remove(followeeId)
```
