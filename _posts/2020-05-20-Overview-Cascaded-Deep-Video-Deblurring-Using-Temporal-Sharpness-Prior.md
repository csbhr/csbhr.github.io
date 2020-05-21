---
layout: post
title: "【论文速览】CVPR2020 | CDVD-TSP: 基于时序清晰先验的级联深度视频去模糊模型"
subtitle:
date: 2020-05-04 17:00:00 -0400
catalog: true
background:
tags:
    - Low-Level
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


## 1. 引言
视频去模糊任务的目标是从给定的模糊视频序列中把潜在清晰视频恢复出来。近年来，使用手持相机和机载相机拍摄的视频越来越多，由此导致的视频模糊问题收到了学术界和工业界广泛的关注。造成视频模糊的主要因素包括相机抖动、物体运动、景深变化等。

早期，基于手工先验的方法 [1] 针对视频去模糊问题提出了有效的先验，具有良好的可扩展性，但这些方法会带来复杂的优化问题，且对运动模糊的估计十分敏感。目前，基于深度卷积神经网络的方法 [2, 3] 在处理这一问题上取得了很大的成功，这些方法大多基于现有的端到端的大容量网络模型，采用大容量网络模型的一个好处就是可以很好的拟合问题并可以在现有合成数据集上取得很好的效果，但是它往往会导致模型训练困难以及可扩展性差的问题。

针对这一问题，本文提出了一个简单而有效的深度卷积神经网络模型，通过引入有效的先验知识使得网络更加紧致，从而有效地解决视频去模糊问题。该论文已被 CVPR 2020 接收。

## 2. 算法详细介绍
![Figure 1. 一个 Stage 的总览图](https://s1.ax1x.com/2020/03/31/GQutu8.png)

由于我们的算法需要从潜在清晰帧的中间结果中估计光流，需要引入一个反馈机制，所以我们采用了级联的训练策略，上图是一个 Stage 的总览图。

在每个 Stage 中，算法主要包括三个部分：光流估计模块（Optical Flow Estimation Module）、潜在清晰图像重建模块（Latent Image Restoration Module）、以及时序清晰先验（Temporal Sharpness Prior）。且每个 Stages 的参数是共享的，即这个反馈机制不会增加模型的参数量。接下来会对算法的各个部分和机制做出详细的介绍，为了方便论述，我们以相邻的三帧模糊序列作为输入来进行介绍。

### 2.1 光流估计模块
光流估计模块是从输入的相邻帧之间计算光流，从而为潜在清晰图像的重建提供运动信息。我们使用 PWC-Net 作为光流估计算法。给定相邻的两帧 $I_i$ 和 $I_{i+1}$，我们可以通过下面的方式计算光流：

$$u_{i\rightarrow i+1}=N_f(I_i;I_{i+1})$$

其中，$N_f$ 是光流估计网络（PWC-Net），对于任意的两帧输入，这个光流估计网络都是参数共享的。

### 2.2 潜在清晰图像重建模块
由于我们已经估计出了光流 $u_{i+1\rightarrow i}$ 和 $u_{i-1\rightarrow i}$，相邻帧 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 可以对齐到 $I_i(x)$，则我们可以通过下面的方式来更新 $I_i(x)$：

$$I_i(x)\leftarrow \frac{1}{3}(I_{i+1}(x+u_{i+1\rightarrow i})+I_{i-1}(x+u_{i-1\rightarrow i})+I_i(x))$$

但是，由于 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 的未完全对齐，以及遮挡原因，这样的计算方式会引入大量的伪影。为了解决这个问题，我们把 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 作为指引，使用 CNN 模型来恢复潜在清晰帧 $I_i(x)$，即：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x)))$$

其中 $C(·)$ 是 concatenation 操作，$N_l$ 是潜在清晰帧重建网络。

### 2.3 时序清晰先验
视频中的模糊是不均匀的，因此相邻帧中很可能存在一些像素是不模糊的。我们期望挖掘这些清晰像素来帮助视频的去模糊过程。

如果 $I_i(x)$ 中的像素 $x$ 清晰的话，那么这个像素的值应该与 $I_{i+1}(x+u_{i+1\rightarrow i})$ 和 $I_{i-1}(x+u_{i-1\rightarrow i})$ 接近。因此，我们定义下面的准则来评判像素 $x$ 的清晰程度：

$$S_i(x) = exp(-\frac{1}{2} \sum_{j\&j\neq0}D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x)))$$

其中 $D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))$ 是用来衡量像素之间的差距，我们将其定义为：

$$D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x)) = \sum_{y\in \omega(x)} \| I_{i+j}(y+u_{i+j \rightarrow i}) - I_i(y) \|^2$$

其中 $\omega(x)$ 是以像素 $x$ 为中心的 patch。如果 $S_i(x)$ 的值越接近于 $1$，则说明这个像素越清晰。由于引入了时序清晰先验 $S_i(x)$，我们可以修改潜在清晰帧的重建过程为：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x);S_i(x)))$$

### 2.4 级联训练策略
下图总结了级联训练策略的主要步骤，其中 $T$ 为 Stages 的个数，为了在性能和效率上取得平衡，我们在使用中设置 $T=2$ ：

![Figure 2. 级联训练策略步骤图](https://s1.ax1x.com/2020/04/23/JdZcFO.png)

## 3. 主要实验结果

### 3.1 Benchmark 数据集
下图是在 DVD 数据集 [4] 上的定量评估结果，可见我们的方法在 PSNR/SSIM 上达到了 SOTA 的效果。我们进一步将算法训练到收敛，得到了高于 paper 中的结果，下图中 Ours* 是训练到收敛的结果，Ours 是 paper 结果。

![Table 1. 在 DVD 上的定量评估结果](https://s1.ax1x.com/2020/03/31/GQOAv6.png)

下图是 DVD 数据集上的视觉效果，我们的方法能够有效地恢复出图像的结构和细节。

![Figure 3. 在 DVD 上的视觉效果](https://s1.ax1x.com/2020/03/31/GQt01g.png)

我们进一步在 GOPRO 数据集 [5] 上比较了这些算法，下图分别为定量评估结果和视觉效果。

![Table 2. 在 GOPRO 上的定量评估结果](https://s1.ax1x.com/2020/03/31/GQYZi8.png)

![Figure 4. 在 GOPRO 上的视觉效果](https://s1.ax1x.com/2020/03/31/GQtgA0.png)

### 3.2 真实场景数据集
我们也在真实场景的视频去模糊数据集 [6] 上评估了我们的算法，下图显示我们的算法得到的结果更加清晰，包含更好的细节和结构，例如图中的行人和桥。

![Figure 5. 在真实场景数据集上的视觉效果](https://s1.ax1x.com/2020/03/31/GQtf9U.png)

## 4. 总结
本文针对视频去模糊问题，提出了一个简单而有效的深度卷积神经网络模型，同时对光流进行估计和对潜在清晰图像进行恢复。在模型中，我们引入了在基于变分模型方法中广泛使用的优化原理，同时还提出了时序清晰先验来帮助潜在清晰图像的恢复。为了有效地训练本文的算法，我们采用了级联的训练策略，使得深度模型更加紧致而有效，在 Benchmark 数据集和真实场景视频中都达到了 SOTA 的效果。

## Reference
- [1] Tae Hyun Kim and Kyoung Mu Lee. Generalized video deblurring for dynamic scenes. In CVPR, pages 5426–5434, 2015.
- [2] Shangchen Zhou, Jiawei Zhang, Jinshan Pan, Haozhe Xie, Wangmeng Zuo, and Jimmy Ren. Spatio-temporal filter adaptive network for video deblurring. In ICCV, pages 2482–2491, 2019
- [3] Xintao Wang, Kelvin C.K. Chan, Ke Yu, Chao Dong, and Chen Change Loy. EDVR: Video restoration with enhanced deformable convolutional networks. In CVPR Workshops, 2019.
- [4] Shuochen Su, Mauricio Delbracio, Jue Wang, Guillermo Sapiro, Wolfgang Heidrich, and Oliver Wang. Deep video deblurring for hand-held cameras. In CVPR, pages 237–246, 2017.
- [5] Seungjun Nah, Tae Hyun Kim, and Kyoung Mu Lee. Deep multi-scale convolutional neural network for dynamic scene deblurring. In CVPR, pages 257–265, 2017.
- [6] Sunghyun Cho, Jue Wang, and Seungyong Lee. Video deblurring for hand-held cameras using patch-based synthesis. ACM TOG, 31(4):64:1–64:9, 2012.
