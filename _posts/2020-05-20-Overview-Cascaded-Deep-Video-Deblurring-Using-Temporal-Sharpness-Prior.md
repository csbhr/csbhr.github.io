---
layout: post
title: "【论文速览】CVPR2020 | CDVD-TSP: 基于时序清晰先验的级联深度视频去模糊模型"
subtitle:
date: 2020-05-04 17:00:00 -0400
catalog: true
background:
tags:
    - Deep-Learning
    - Video-Deblurring
    - CVPR2020
---

# CDVD-TSP: 基于时序清晰先验的级联深度视频去模糊模型

> 论文名称：Cascaded Deep Video Deblurring Using Temporal Sharpness Prior  
> 作者：Jinshan Pan, Haoran Bai, and Jinhui Tang  
> 论文下载：[https://arxiv.org/abs/2004.02501](https://arxiv.org/abs/2004.02501)  
> 项目主页：[https://baihaoran.xyz/projects/cdvd-tsp/index.html](https://baihaoran.xyz/projects/cdvd-tsp/index.html)  
> 开源代码：[https://github.com/csbhr/CDVD-TSP](https://github.com/csbhr/CDVD-TSP)

## 1. 摘要
本文提出了一个简单有效的视频去模糊算法。与以往基于端到端深度神经网络黑箱的方法不同，本文将视频去模糊问题中的领域知识嵌入到深度卷积神经网络中，使得深度卷积神经网络能够更好地刻画视频的性质。通过嵌入领域知识，本文所提出的深度卷积神经网络模型更加紧致，并且在准确性和可扩展性上面取得了先进的效果。

## 2. 研究背景
视频去模糊任务的目标是从给定的模糊视频序列中把潜在清晰视频恢复出来。近年来，使用手持相机和机载相机拍摄的视频越来越多，由此导致的视频模糊问题受到了学术界和工业界的广泛关注。造成视频模糊的主要因素包括相机抖动、物体运动、景深变化等。

传统的基于手工先验的方法，大多通过刻画视频的性质来约束视频去模糊问题（如文献[1]）。这类方法能够较好地刻画视频去模糊问题，并具有良好的可扩展性，但这些方法会带来复杂的优化问题，且对视频中运动模糊的估计十分敏感。目前，基于深度卷积神经网络的方法（如文献[2, 3]）在处理这一问题上取得了很大的成功，这些方法大多基于现有的端到端的大容量网络模型。采用大容量网络模型的一个好处就是可以很好的拟合问题并可以在现有合成数据集上取得很好的效果，但是它往往会导致模型训练困难以及可扩展性差的问题。针对这一问题，本文提出了一个简单而有效的深度卷积神经网络模型，通过引入有效的先验知识使得网络更加紧致，从而有效地解决视频去模糊问题。该论文已被 CVPR 2020 接收。

## 3. 算法详细介绍
![图 1. 所提方法在一个级联层上的流程图](https://s1.ax1x.com/2020/03/31/GQutu8.png)

本文的方法主要包括三个部分：光流估计、潜在清晰图像重建以及时序清晰先验计算。为了更好的计算时序清晰先验，本文采用了级联式的训练方法。图1给出了本文放在一个级联层上的流程图。为了方便论述，本文以相邻的三帧模糊序列作为输入来进行介绍。

### 3.1 光流估计模块
光流估计模块是从输入的相邻帧之间计算光流，从而为潜在清晰图像的重建提供运动信息。本文使用 PWC-Net 作为光流估计算法。给定相邻的两帧 $I_i$ 和 $I_{i+1}$，本文可以通过下面的方式计算光流：

$$u_{i\rightarrow i+1}=N_f(I_i;I_{i+1}) \tag{1} $$

其中，$N_f$ 是光流估计网络（PWC-Net）。对于任意的两帧输入，光流估计网络 $N_f$ 都是参数共享的。

### 3.2 潜在清晰图像重建模块
基于估计的光流结果 $u_{i+1\rightarrow i}$ 和 $u_{i-1\rightarrow i}$，可以将相邻帧 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 对齐到 $I_i(x)$，于是可以通过下面的方式来更新 $I_i(x)$：

$$I_i(x)\leftarrow \frac{1}{3}(I_{i+1}(x+u_{i+1\rightarrow i})+I_{i-1}(x+u_{i-1\rightarrow i})+I_i(x)) \tag{2} $$

由于在实际中光流计算导致的误差，$I_{i+1}(x)$ 和 $I_{i-1}(x)$ 并不一定完全对齐，这样的计算方式会引入大量的伪影。为了解决这个问题，本文把 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 作为引导图像，使用卷积神经网络模型来恢复潜在清晰帧 $I_i(x)$，即：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x))) \tag{3} $$

其中 $C(·)$ 是连接操作，$N_l$ 是潜在清晰帧重建网络。

### 3.3 时序清晰先验
视频中的模糊是不均匀的，因此相邻帧中很可能存在一些像素是清晰的[6]。本文通过挖掘这些清晰像素来帮助视频去模糊。如果 $I_i(x)$ 中的像素点 $x$ 清晰，则这个像素点的值应该与 $I_{i+1}(x+u_{i+1\rightarrow i})$ 和 $I_{i-1}(x+u_{i-1\rightarrow i})$ 接近。因此，本文定义下面的准则来评判像素点 $x$ 的清晰程度：

$$S_i(x) = exp(-\frac{1}{2} \sum_{j\&j\neq0}D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))) \tag{4} $$

其中 $D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))$ 是用来衡量像素之间的差距，其定义为：

$$D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x)) = \sum_{y\in \omega(x)} \| I_{i+j}(y+u_{i+j \rightarrow i}) - I_i(y) \|^2 \tag{5} $$

其中 $\omega(x)$ 是以像素 $x$ 为中心的区域。如果 $S_i(x)$ 的值越接近于1，则说明这个像素越清晰。由于引入了时序清晰先验 $S_i(x)$，本文通过以下公式计算清晰帧：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x);S_i(x))) \tag{6} $$

### 3.4 级联训练策略
假定 $\Theta_t$ 是算法第 $t$ 个级联层的网络参数，给出 $N$ 个视频序列作为训练样本 $(B_i^n, I_{gt,i}^n)_{i=1}^M$，通过最小化下面的代价函数对 $\Theta_t$ 进行优化：

$$J(\theta_t)=\sum_{n=1}^N \sum_{i=1}^M \| F_{\theta_t}(B_{i-j}^n;...;B_i^n;...;B_{i+j}^n)-I_{gt,i}^n \|_1 \tag{7} $$

其中，$F_{\Theta_t}$ 是视频去模糊的整个网络，以 $2j+1$ 个模糊帧作为输入，输出第 $t$ 个级联层的潜在清晰帧的中间结果。

算法1总结了级联训练方法的主要步骤，其中 $T$ 是级联层的个数，考虑到性能和效率的平衡问题，本文取 $T=2$ 。

![算法 1. 级联训练方法的主要步骤](https://s1.ax1x.com/2020/05/25/t9HpUx.png)

## 4. 主要实验结果

### 4.1 基准数据集
表1是在 DVD 数据集（由文献[4]提出）上的定量评估结果，可见本文提出的方法在该数据集上取得了先进的效果。

![表 1. DVD 数据集上的定量评估结果](https://s1.ax1x.com/2020/05/25/t97JN6.png)

图2是 DVD 数据集上的视觉比较结果，本文提出的方法能够有效地恢复出图像的结构和细节。

![图 2. DVD 数据集上的视觉比较结果](https://s1.ax1x.com/2020/03/31/GQt01g.png)

本文进一步在 GOPRO 数据集（由文献[5]提出）上比较了这些算法，表2和图3分别为定量和定性评估结果。

![表 2. GOPRO 数据集上的定量评估结果](https://s1.ax1x.com/2020/03/31/GQYZi8.png)

![图 3. GOPRO 数据集上的视觉比较结果](https://s1.ax1x.com/2020/03/31/GQtgA0.png)

### 4.2 真实场景数据集
本文也在真实场景的视频去模糊数据集（由文献[6]提出）上评估了本文提出的算法，图4显示本文提出的算法得到的结果更加清晰，包含更好的细节和结构，例如图中的行人和桥。

![图 4. 真实场景数据集上的视觉比较结果](https://s1.ax1x.com/2020/03/31/GQtf9U.png)

## 5. 总结
本文针对视频去模糊问题，提出了一个简单而有效的深度卷积神经网络模型，同时估计光流和恢复潜在清晰图像。本文将视频去模糊问题中的领域知识嵌入到深度卷积神经网络中，使得深度卷积神经网络能够更好地刻画视频的性质。为了有效地训练本文的算法，本文采用了级联式的训练方法，使得深度模型更加紧致而有效，并在现有基准数据集和真实场景视频中都取得了先进的效果。

## Reference
- [1] Tae Hyun Kim and Kyoung Mu Lee. Generalized video deblurring for dynamic scenes. In CVPR, pages 5426–5434, 2015.
- [2] Shangchen Zhou, Jiawei Zhang, Jinshan Pan, Haozhe Xie, Wangmeng Zuo, and Jimmy Ren. Spatio-temporal filter adaptive network for video deblurring. In ICCV, pages 2482–2491, 2019
- [3] Xintao Wang, Kelvin C.K. Chan, Ke Yu, Chao Dong, and Chen Change Loy. EDVR: Video restoration with enhanced deformable convolutional networks. In CVPR Workshops, 2019.
- [4] Shuochen Su, Mauricio Delbracio, Jue Wang, Guillermo Sapiro, Wolfgang Heidrich, and Oliver Wang. Deep video deblurring for hand-held cameras. In CVPR, pages 237–246, 2017.
- [5] Seungjun Nah, Tae Hyun Kim, and Kyoung Mu Lee. Deep multi-scale convolutional neural network for dynamic scene deblurring. In CVPR, pages 257–265, 2017.
- [6] Sunghyun Cho, Jue Wang, and Seungyong Lee. Video deblurring for hand-held cameras using patch-based synthesis. ACM TOG, 31(4):64:1–64:9, 2012.
