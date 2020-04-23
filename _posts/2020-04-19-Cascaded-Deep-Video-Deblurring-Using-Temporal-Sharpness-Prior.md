---
layout: post
title: "【论文解读】CVPR2020 | CDVD-TSP: 基于时序清晰先验的级联深度视频去模糊模型"
subtitle:
date: 2020-04-19 17:00:00 -0400
catalog: true
background:
tags:
    - Low-Level
    - Deep-Learning
    - Video-Deblurring
---

# CDVD-TSP: 基于时序清晰先验的级联深度视频去模糊模型

> 论文名称：Cascaded Deep Video Deblurring Using Temporal Sharpness Prior  
> 作者：Jinshan Pan, Haoran Bai, and Jinhui Tang  
> 论文下载：[https://arxiv.org/abs/2004.02501](https://arxiv.org/abs/2004.02501)  
> 项目主页：[https://baihaoran.xyz/projects/cdvd-tsp/index.html](https://baihaoran.xyz/projects/cdvd-tsp/index.html)  
> 开源代码：[https://github.com/csbhr/CDVD-TSP](https://github.com/csbhr/CDVD-TSP)


## 1. 引言
本文将会介绍我们在 CVPR2020 录用的论文 “Cascaded Deep Video Deblurring Using Temporal Sharpness Prior”。此论文提出了一个简单而有效的深度卷积神经网络模型来解决视频去模糊问题。

Video Deblurring（视频去模糊）任务的目标是从一个模糊视频序列中估计潜在清晰图像。由于使用手持相机和机载相机拍摄的视频越来越多，视频去模糊问题在近些年收到了广泛的关注。视频中模糊主要来源于相机的抖动、物体的运动、以及景深的变化。但是，由于只给出了模糊的视频，视频去模糊任务是一个高度病态的问题。

### 1.1 相关工作

为了从模糊视频序列中恢复潜在清晰图像，传统方法总会对运动模糊和潜在图像作出一些假设 [12, 2, 4, 11, 5, 29]，如把运动模糊建模为光流（Optical Flow）[12, 2, 5, 29]。这些方法成功地关键在于：利用一些手工先验的约束联合估计光流和潜在图像。但是，在运动模糊和潜在图像作出的假设会带来十分复杂的目标函数，十分难解。

受启发于 CNNs 在单图像去模糊任务上的成功，一些方法也把 CNNs 引入到视频去模糊任务中来。这些方法通常是把模糊视频序列 concatenate 在一起作为网络的输入来估计潜在图像 [24]，或是引入递归网络 [13] 和 3D 卷积 [31] 来辅助潜在图像的重建。这些方法在模糊不明显、目标位移不大的视频中效果较好，但是当视频中的模糊明显、位移较大时，这些方法的效果就会下降很多，这是由于没有考虑帧间对齐的影响。

为了解决这个问题，一些方法会显式 [14, 3, 27] 或隐式 [32] 的对齐输入的连续帧来帮助潜在图像的恢复。如应用光流 [3] 或可形变卷积（Deformable Convolution）[27] 来对输入的连续帧进行对齐。这些方法证明了：应用合适的对齐策略，可以有效的提升视频去模糊的效果。但是这些方法大都得益于采用大容量的模型，这一定程度上导致这些方法不能有效的处理真实场景视频。

### 1.2 本文方法动机

为了更好的阐述本文方法的动机，首先回顾一下传统基于变分模型的方法。

对于视频中的模糊退化过程，可以把第 $i$ 个模糊图像定义为：

$$B_i=\frac{1}{2\tau }\int_{t=0}^{\tau }H^t_{i\rightarrow i+1}(I_i)+H^t_{i\rightarrow i-1}(I_i)dt \tag{1} $$

其中$B_i$ 是第 $i$ 个模糊图像，$I_i$ 是第 $i$ 个清晰图像，$\tau$ 是曝光时间，$H^t_{i\rightarrow i+1}$ 和 $H^t_{i\rightarrow i-1}$ 是 warping 函数把 $I_i$ 分别 warp 到 $I_{i+1}$ 和 $I_{i-1}$。如果把两个方向的光流定义为 $u_{i\rightarrow i+1}$ 和 $u_{i\rightarrow i-1}$，则 $H^t_{i\rightarrow i+1}$ 和 $H^t_{i\rightarrow i-1}$ 可以表示为 $I_i(x+tu_{i\rightarrow i+1})$ 和 $I_i(x+tu_{i\rightarrow i-1})$。

基于上面的退化模型，可以把视频去模糊的过程建模为最小化下面的目标函数：

$$L(u, I)=L(I)+L(u) \tag{2} $$

$L(I)$ 是对潜在图像 $I_i$ 的优化，下式中 $W(I_i)$ 是上述的退化过程，$\varphi (I_i)$ 是对潜在图像 $I_i$ 的约束，$L(I)$ 定义为：

$$L(I)=\sum_{i}\rho_I(W(I_i),B_i)+\varphi (I_i) \tag{3} $$

$L(u)$ 是对光流 $u_{i\rightarrow i+j}$ 的优化，下式中 $\phi (u_{i\rightarrow i+j})$ 是对光流 $u_{i\rightarrow i+j}$ 的约束，$L(u)$ 定义为：

$$L(u)=\sum_{i}\sum_{j}\rho_u(I_i,I_{i+j}(x+u_{i\rightarrow i+j}))+\phi (u_{i\rightarrow i+j}) \tag{4} $$

在传统基于变分模型的方法的优化过程是：通过交替最小化 $L(I)$ 和 $L(u)$ 来优化潜在图像 $I_i$ 和光流 $u$。我们注意到：交替交替最小化 $L(I)$ 和 $L(u)$ 可以有效去除视频中模糊。这得益于用潜在图像的中间结果优化光流可以使光流更加准确，更加准确地光流也可以帮助潜在图像的恢复。但是这种基于变分模型的方法十分依赖于 $\varphi (I_i)$ 和 $\phi (u_{i\rightarrow i+j})$ 的选择，这往往会带来十分难解的目标函数。

我们进一步观察到，大多数基于 CNN 的方法直接从输入模糊视频中估计清晰视频，但是这些方法是从输入的模糊图像中估计光流，而不是从潜在图像的中间结果估计光流，且没有探索视频去模糊的 Domain Knowledge，这导致不能有效的处理模糊明显、位移较大的视频。

那我们是不是可以把基于变分模型方法中的优化原则、以及有效的先验知识引入到 CNN 模型中，从而让 CNNs 更加紧凑有效呢？

### 1.3 本文方法概述
为了解决上述的问题，我们使用了一个简单而有效的深度卷积神经网络模型来解决视频去模糊问题。不同于基于变分的方法（通过 warp 连续帧来产生模糊帧），我们的算法会把相邻帧向中间帧 warp，即将连续帧向中间帧对齐，从而帮助潜在帧的恢复。对齐后的视频序列往往会存在大量的伪影和模糊，我们构建了基于 Encoder-Decoder 框架的 CNN 模型，用对齐后的序列作为输入，直接重建潜在帧。为了更好地挖掘连续帧之间的特性，我们还引入了时序清晰先验来约束 CNN 模型。

并且，我们的算法需要从重建潜在帧的中间结果中估计光流，这需要引入一个反馈回路机制。为了有效的训练本文的算法，我们采用了级联的训练策略，并把所有模块联合在一起实现端到端的训练。

总结一下本文的主要贡献有：
- 针对视频去模糊，我们提出了一个简单而有效的深度卷积神经网络模型，同时估计光流和潜在帧。
- 为了更好地挖掘连续帧之间的特性，我们引入了时序清晰先验来约束 CNN 模型。
- 通过定量和定性的评估，我们的算法在 Benchmark 数据集和 Real-World 数据集上，都可以表现出 SOTA 的效果。


## 2. 算法详细介绍
![一个 Stage 的方法总览图](https://s1.ax1x.com/2020/03/31/GQutu8.png "一个 Stage 的方法总览")

由于我们的算法需要从潜在帧的中间结果中估计光流，这需要引入一个反馈回路机制，我们采用了级联的训练策略，即算法包含 $T$ 个 Stages，上图是一个 Stage 的方法总览。

在每个 Stage 中，算法主要包括三个部分：光流估计模块（Optical Flow Estimation Module）、潜在图像重建模块（Latent Image Restoration Module）、以及时序清晰先验（Temporal Sharpness Prior）。且这 T 个 Stages 是参数共享的，即这个反馈回路机制不会增加模型的参数量。

光流估计模块可以为潜在图像重建提供有效的运动信息，而潜在图像重建模块会进一步提高光流估计的准确性。时序清晰先验能够从相邻的帧中识别清晰的像素，这可以有效的促进帧的重建。接下来会对算法的各个部分和机制作出详细的介绍，为了方便论述，我们以相邻的三帧模糊序列作为输入来进行介绍。

### 2.1 光流估计模块
光流估计模块是从输入的相邻帧之间计算光流，从而为潜在图像的重建提供运动信息。我们使用 PWC-Net [25] 作为光流估计算法。给定相邻的两帧 $I_i$ 和 $I_{i+1}$，我们可以通过下面的方式计算光流：

$$u_{i\rightarrow i+1}=N_f(I_i;I_{i+1}) \tag{5} $$

其中，$N_f$ 是光流估计网络（PWC-Net），对于任意的两帧输入，这个光流估计网络都是参数共享的。

### 2.2 潜在图像重建模块
在上文中的退化模型 (1)，$W(I_i)$ 是为了生成模糊的帧，使其尽可能的接近输入帧 $S_i$，它的离散形式可以写成：

$$W(I_i)=\frac{1}{1+2\tau }\sum_{d=1}^\tau (H^t_{i\rightarrow i+1}(I_i)+H^t_{i\rightarrow i-1}(I_i)+I_i(x)) \tag{6} $$

借助光流 $u_{i\rightarrow i+1}$ 和 $u_{i\rightarrow i-1}$，如果我们设置 $\tau=1$，上式可以写为：

$$W(I_i)=\frac{1}{3}(I_i(x+u_{i\rightarrow i+1})+I_i(x+u_{i\rightarrow i-1})+I_i(x)) \tag{7} $$

不同于上式生成模糊帧，我们的目的是生成清晰帧，由于我们已经估计出了光流 $u_{i+1\rightarrow i}$ 和 $u_{i-1\rightarrow i}$，相邻帧 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 可以对齐到 $I_i(x)$，则我们可以通过下面的方式来更新 $I_i(x)$：

$$I_i(x)\leftarrow \frac{1}{3}(I_{i+1}(x+u_{i+1\rightarrow i})+I_{i-1}(x+u_{i-1\rightarrow i})+I_i(x)) \tag{8} $$

但是，由于 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 的未完全对齐，以及遮挡原因，这样的计算方式会引入大量的伪影。为了解决这个问题，我们把 $I_{i+1}(x)$ 和 $I_{i-1}(x)$ 作为指引，使用 CNN 模型来恢复潜在帧 $I_i(x)$，即：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x))) \tag{9} $$

其中 $C(·)$ 是 concatenation 操作，$N_l$ 是潜在帧重建网络，对于 $N_l$ ，我们使用 [26] 使用的网络结果，不过我们去除了 ConvLSTM 模块，其他网络结构是一样的。

### 2.3 时序清晰先验
正如在 [4] 中论述的，视频中的模糊是不均匀的，因此相邻帧中很可能存在一些像素是不模糊的。与传统方法 [4] 相似，我们期望挖掘这些清晰像素来帮助视频的去模糊过程。

对于对齐后相邻帧 $I_{i+1}(x+u_{i+1\rightarrow i})$ 和 $I_{i-1}(x+u_{i-1\rightarrow i})$，如果 $I_i(x)$ 中的像素 $x$ 清晰的话，那么这个像素的值应该与 $I_{i+1}(x+u_{i+1\rightarrow i})$ 和 $I_{i-1}(x+u_{i-1\rightarrow i})$ 接近。因此，我们定义下面的准则来评判像素 $x$ 的清晰程度：

$$S_i(x) = exp(-\frac{1}{2} \sum_{j\&j\neq0}D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))) \tag{10} $$

其中 $D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))$ 是用来衡量像素之间的差距，定义为 $\|\| I_{i+j}(x+u_{i+j \rightarrow i} - I_i(x) \|\|^2$。如果 $S_i(x)$ 的值越接近于 $1$，则说明这个像素越清晰。

为了增强 $S_i(x)$ 上的鲁棒性，我们进一步将 $D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x))$ 定义为：

$$D(I_{i+j}(x+u_{i+j \rightarrow i}); I_i(x)) = \sum_{y\in \omega(x)} \| I_{i+j}(x+u_{i+j \rightarrow i} - I_i(x) \|^2 \tag{11} $$

其中 $\omega(x)$ 是以像素 $x$ 为中心的 patch。由于引入了时序清晰先验 $S_i(x)$，我们可以修改潜在帧的重建过程 (9) 为：

$$I_i(x)\leftarrow N_l(C(I_{i+1}(x+u_{i+1\rightarrow i});I_{i-1}(x+u_{i-1\rightarrow i});I_i(x);S_i(x))) \tag{12} $$

### 2.4 算法的训练
设 $\theta_t$ 是算法第 t 个 Stage 的模型参数，对于N 个视频序列训练样本 $\left ( B_i^n,I_{gt,i}^n \right )_{i=1}^M$，将 $2j+1$ 个模糊帧作为模型的输入，模型参数 $\theta_t$ 可以通过最小化下面的代价函数学习：

$$J(\theta_t)=\sum_{n=1}^N\sum_{i=1}^M \| F_{\theta_t}(B_{i-j}^n;...;B_i^n;...;B_{i+j}^n)-I_{gt,i}^n \|_1 \tag{13} $$

其中，$F_{\theta_t}$ 是视频去模糊的整个网络，以 $2j+1$ 个模糊帧作为输入，输出为第 t 个 Stage 的潜在帧的中间结果。

下图（Algorithm 1）总结了级联训练策略的主要步骤，其中 $T$ 为 Stages 的个数，为了在性能和效率上取得平衡，我们在使用中设置 $T=2$ ：

![级联训练策略主要步骤图](https://s1.ax1x.com/2020/04/23/JdZcFO.png "级联训练策略主要步骤")

## 3. 实验结果
为了评估本文方法的性能，我们将其与 SOTA 算法进行比较，其中包括基于变分模型的方法 [12] 和基于 CNNs 的方法 [24, 7, 27, 13, 14, 32, 26]。

### 3.1 合成数据集
下图是在 Benchmark 数据集 [24] 上的定量评估结果，可见我们的方法在 PSNR/SSIM 上达到了 SOTA 的效果。我们进一步将算法训练到收敛，得到了高于 paper 中的结果，下图中 Ours* 是训练到收敛的结果，Ours 是 paper 结果。

![数据集24上的定量评估结果图](https://s1.ax1x.com/2020/03/31/GQOAv6.png "数据集24上的定量评估结果")

下图是数据集 [24] 上的视觉效果，通过对比发现：基于变分模型的方法 [12] 并没有恢复好图像的结果，生成的结果中还包含明显的模糊；方法 [26] 使用单帧作为输入来重建潜在帧，结果还存在大量的模糊残余；方法 [24] 仅仅把视频序列 concatenate 在一起输入网络，没有进行对齐操作，这使得生成的结果的结构并不清晰；方法 [27] 中首先使用 PreDeblur 模块去模糊，当这个 PreDeblur 没有把输入帧的模糊去掉时，整体的效果就很下降，生成的结果的结构得不到有效的恢复。而我们的方法能够有效地恢复出图像的结构和细节。

![数据集24上的视觉效果图](https://s1.ax1x.com/2020/03/31/GQt01g.png "数据集24上的视觉效果")

我们进一步在 GOPRO 数据集 [20] 上比较了这些算法，下图分别为定量评估结果和视觉效果，我们的算法均达到了 SOTA 效果。

![数据集20上的定量评估结果图](https://s1.ax1x.com/2020/03/31/GQYZi8.png "数据集20上的定量评估结果")

![数据集20上的视觉效果图](https://s1.ax1x.com/2020/03/31/GQtgA0.png "数据集20上的视觉效果")

### 3.2 真实数据集
我们也真实场景的视频去模糊数据集 [4] 上评估了我们的算法，下图显示我们的算法得到了更加清晰的结果，结果中包含更好的细节和结构。例如图中的行人和桥。

![数据集4上的视觉效果图](https://s1.ax1x.com/2020/03/31/GQtf9U.png "数据集4上的视觉效果")

## 4. 分析与讨论
为了进一步理解我们的算法，这一章节，会对算法中各个模块的作用进行分析，以及讨论算法的局限性。

### 4.1 级联训练策略的作用
级联训练策略是为了能够从潜在帧的中间结果中估计光流，同时迭代的更新潜在帧的中间结果。为了分析级联训练的作用，我们比较了不使用级联训练策略（即设置 Algorithm 1 中 $T=1$）的结果，下图分别是在数据集 [24] 上的定量结果和视觉效果，我们发现不使用级联训练（实际上就是CNN方法常用的从模糊帧中估计光流的策略）并不能生成高质量的去模糊结果（见视觉效果图中的(b)），且随着 Stage 数的增加，去模糊的效果逐渐增加，Stage-3 在 Stage-2 上效果提升有限，我们为了在性能和效率上取得平衡，设置了 $T=2$。

![级联训练策略作用的定量评估结果图](https://s1.ax1x.com/2020/04/23/Jd6sBj.png "级联训练策略作用的定量评估结果")

![级联训练策略作用的视觉效果图](https://s1.ax1x.com/2020/03/31/GQw5wj.png "级联训练策略作用的视觉效果")

我们进一步注意到，直接从模糊图像中估计出来的光流的边界比较模糊（见下图(d)），而从潜在帧的中间结果中估计出来的光流的边界会更加清晰（见下图(f)），清晰的光流会提升潜在帧的重建效果（见下图(c)）。

![级联训练策略对光流的影响图](https://s1.ax1x.com/2020/03/31/GQw7Yq.png "级联训练策略对光流的影响")

### 4.2 时序清晰先验的作用
我们引入时序清晰先验，是为了更好地挖掘连续帧之间的特性，从而约束 CNN 模型更加的高效紧凑。为了分析时序清晰先验的作用，我们比较了不使用时序清晰先验的结果，我们在数据集 [24] 中选取了 4 个模糊显著的视频，下图是在这 4 个视频上的定量结果和视觉效果。结果显示，在视频模糊显著的时候，时序清晰先验能够有效的区分出清晰像素，从而帮助 CNN 模型获得更好的重建效果。

![时序清晰先验作用的定量评估结果图](https://s1.ax1x.com/2020/04/23/Jd6jgO.png "时序清晰先验作用的定量评估结果")

![时序清晰先验作用的视觉效果图](https://s1.ax1x.com/2020/03/31/GQ0e7d.png "时序清晰先验作用的视觉效果")

### 4.3 光流估计的作用
为了分析光流估计的作用，我们比较了不使用光流估计（直接把视频序列 concatenate 在一起输入网络）的结果，同时还比较了把 PWC-Net 换成 FlowNet 2.0 的结果。下图是在数据集 [24] 上的定量结果，结果显示，光流估计可以改善视频去模糊的性能，而且对光流估计方法较为鲁棒。

![光流估计作用的定量评估结果图](https://s1.ax1x.com/2020/04/23/JdcGxU.png "光流估计作用的定量评估结果")

### 4.4 模型容量
我们算法的目的是使用视频去模糊的 Domain Knowledge 来提升去模糊的性能，且不增加模型的容量。我们计算了模型的容量，如下图，发现我们的算法比方法 [27] 有着更小的模型尺寸，且相比较于 Baseline 方法，我们的方法在不增加模型尺寸的情况下显著提升了算法性能。

![模型容量图](https://s1.ax1x.com/2020/04/23/JdcNqJ.png "模型容量")

### 4.5 算法的局限性
虽然时序清晰先验在视频模糊显著的情况下有效，但是当视频中的所有帧的每一个像素都存在模糊时，时序清晰先验的效果会大打折扣。因为在这些视频中，时许清晰先验不能有效的区分出像素是否清晰。我们在数据集 [24] 中选取了 3 个每帧都模糊的视频，下图是在这 3 个视频上的定量结果，我们主要到使用时序清晰先验并不能有效地提升去模糊的效果。

![时序清晰先验失效的定量评估结果图](https://s1.ax1x.com/2020/04/23/JdcBPx.png "时序清晰先验失效的定量评估结果")


## Reference
- [1] Miika Aittala and Frédo Durand. Burst image deblurring using permutation invariant convolutional neural networks. In ECCV, pages 748–764, 2018. 2
- [2] Leah Bar, Benjamin Berkels, Martin Rumpf, and Guillermo Sapiro. A variational framework for simultaneous motion estimation and restoration of motion-blurred video. In ICCV, pages 1–8, 2007. 1
- [3] HuaijinChen, JinweiGu, OrazioGallo, Ming-YuLiu, Ashok Veeraraghavan, and Jan Kautz. Reblur2deblur: Deblurring videos via self-supervised learning. In ICCP, pages 1–9, 2018. 2
- [4] Sunghyun Cho, Jue Wang, and Seungyong Lee. Video deblurring for hand-held cameras using patch-based synthesis. ACM TOG, 31(4):64:1–64:9, 2012. 1, 2, 4, 5, 7
- [5] Shengyang Dai and Ying Wu. Motion from blur. In CVPR, 2008. 1, 2
- [6] Jochen Gast and Stefan Roth. Deep video deblurring: The devil is in the details. In ICCV Workshop, 2019. 1, 2, 6
- [7] Dong Gong, Jie Yang, Lingqiao Liu, Yanning Zhang, Ian D. Reid, Chunhua Shen, Anton van den Hengel, and Qinfeng Shi. From motion blur to motion flow: A deep learning solution for removing heterogeneous motion blur. In CVPR, pages 3806–3815, 2017. 2, 5, 6
- [8] Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun. Delving deep into rectifiers: Surpassing human-level performance on imagenet classification. In ICCV, pages 1026–1034, 2015. 5
- [9] Eddy Ilg, Nikolaus Mayer, Tonmoy Saikia, Margret Keuper, Alexey Dosovitskiy, and Thomas Brox. Flownet 2.0: Evolution of optical flow estimation with deep networks. In CVPR, pages 1647–1655, 2017. 8
- [10] Max Jaderberg, Karen Simonyan, Andrew Zisserman, and Koray Kavukcuoglu. Spatial transformer networks. In NeurIPS, pages 2017–2025, 2015. 2
- [11] Tae Hyun Kim and Kyoung Mu Lee. Segmentation-free dynamic scene deblurring. In CVPR, pages 2766–2773, 2014. 1, 2
- [12] Tae Hyun Kim and Kyoung Mu Lee. Generalized video deblurring for dynamic scenes. In CVPR, pages 5426–5434, 2015. 1, 2, 3, 5, 6, 7
- [13] Tae Hyun Kim, Kyoung Mu Lee, Bernhard Schölkopf, and Michael Hirsch. Online video deblurring via dynamic temporal blending network. In ICCV, pages 4058–4067, 2017. 1, 2, 5, 6, 7
- [14] Tae Hyun Kim, Mehdi S. M. Sajjadi, Michael Hirsch, and Bernhard Schölkopf. Spatio-temporal transformer network for video restoration. In ECCV, pages 111–127, 2018. 2, 5
- [15] Diederik P. Kingma and Jimmy Ba. Adam: A method for stochastic optimization. In ICLR, 2015. 5
- [16] Yunpeng Li, Sing Bing Kang, Neel Joshi, Steven M. Seitz, and Daniel P. Huttenlocher. Generating sharp panoramas from motion-blurred videos. In CVPR, pages 2424–2431, 2010. 2
- [17] Xiao-Jiao Mao, Chunhua Shen, and Yu-Bin Yang. Image restoration using very deep convolutional encoder-decoder networks with symmetric skip connections. In NeurIPS, pages 2802–2810, 2016. 2
- [18] Yasuyuki Matsushita, Eyal Ofek, Weina Ge, Xiaoou Tang, and Heung-Yeung Shum. Full-frame video stabilization with motion inpainting. IEEE TPAMI, 28(7):1150–1163, 2006. 2
- [19] Ben Mildenhall, Jonathan T. Barron, Jiawen Chen, Dillon Sharlet, Ren Ng, and Robert Carroll. Burst denoising with kernel prediction networks. In CVPR, pages 2502–2510, 2018. 2
- [20] Seungjun Nah, Tae Hyun Kim, and Kyoung Mu Lee. Deep multi-scale convolutional neural network for dynamic scene deblurring. In CVPR, pages 257–265, 2017. 5, 6, 7
- [21] Seungjun Nah, Sanghyun Son, and Kyoung Mu Lee. Recurrent neural networks with intra-frame iterations for video deblurring. In CVPR, pages 8102–8111, 2019. 5, 7
- [22] Jinshan Pan, Deqing Sun, Hanspeter Pfister, and MingHsuanYang. Deblurringimagesviadarkchannelprior. IEEE TPAMI, 40(10):2315–2328, 2018. 5, 7
- [23] Deepak Pathak, Philipp Krähenbühl, Jeff Donahue, Trevor Darrell, and Alexei A. Efros. Context encoders: Feature learning by inpainting. In CVPR, pages 2536–2544, 2016. 2
- [24] Shuochen Su, Mauricio Delbracio, Jue Wang, Guillermo Sapiro, Wolfgang Heidrich, and Oliver Wang. Deep video deblurring for hand-held cameras. In CVPR, pages 237–246, 2017. 1, 2, 4, 5, 6, 7, 8
- [25] Deqing Sun, Xiaodong Yang, Ming-Yu Liu, and Jan Kautz. PWC-Net: CNNs for optical flow using pyramid, warping, and cost volume. In CVPR, pages 8934–8943, 2018. 3, 4, 5
- [26] Xin Tao, Hongyun Gao, Xiaoyong Shen, Jue Wang, and Jiaya Jia. Scale-recurrent network for deep image deblurring. In CVPR, pages 8174–8182, 2018. 4, 5, 6, 7
- [27] Xintao Wang, Kelvin C.K. Chan, Ke Yu, Chao Dong, and Chen Change Loy. EDVR: Video restoration with enhanced deformable convolutional networks. In CVPR Workshops, 2019. 1, 2, 5, 6, 7, 8
- [28] Patrick Wieschollek, Michael Hirsch, Bernhard Schölkopf, and Hendrik P. A. Lensch. Learning blind motion deblurring. In ICCV, pages 231–240, 2017. 2, 7
- [29] Jonas Wulff and Michael Julian Black. Modeling blurred video with layers. In ECCV, pages 236–252, 2014. 1, 2
- [30] Rui Xu, Xiaoxiao Li, Bolei Zhou, and Chen Change Loy. Deep flow-guided video inpainting. In CVPR, pages 37233732, 2019. 5
- [31] Kaihao Zhang, Wenhan Luo, Yiran Zhong, Lin Ma, Wei Liu, and Hongdong Li. Adversarial spatio-temporal learning for video deblurring. IEEE TIP, 28(1):291–301, 2019. 1, 2
- [32] Shangchen Zhou, Jiawei Zhang, Jinshan Pan, Haozhe Xie, Wangmeng Zuo, and Jimmy Ren. Spatio-temporal filter adaptive network for video deblurring. In ICCV, 2019. 1, 2, 5, 6, 7, 8
- [33] Daniel Zoran and Yair Weiss. From learning models of naturalimagepatchestowholeimagerestoration. InICCV,pages 479–486, 2011. 2
