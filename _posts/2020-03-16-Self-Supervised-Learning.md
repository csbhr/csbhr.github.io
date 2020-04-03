---
layout: post
title: "Low-level 中的自监督学习"
subtitle: "在 low-level 任务中，自监督学习该如何进行监督？"
date: 2020-03-16 17:00:00 -0400
catalog: true
background:
tags:
    - low-level
    - deep learning
    - self-supervised learning
---

# Low-level 中的自监督学习

在 AAAI 2020 上， Yann 做了关于 “self-supervised learning is the future” 的演讲，他用了这么一个比喻来说明自监督学习的重要性：“如果人工智能是一块蛋糕，那么蛋糕的大部分是自监督学习，蛋糕上的糖衣是监督学习，蛋糕上的樱桃是强化学习”。最近读了一些**图像和视频复原领域**中 self-supervised 的论文，并对其做了一些总结，在此记录下来，看的论文有限，整理的可能有些片面，欢迎讨论交流，会随时更新。

- [关于 SSL](#chapter-1)
- [Low-Level 中 SSL 如何进行监督](#chapter-2)
  - [通过先验对重建结果进行约束](#chapter-2-1)
  - [通过域的转换实现特征分离](#chapter-2-2)
  - [从数据中挖掘信息代替 GT 进行监督](#chapter-2-3)
- [Reference](#reference)

<a name="chapter-1"></a>
## 1. 关于 SSL
SSL(self-supervised learning) 是无监督学习的一种，主要是通过自己监督自己的方式训练模型。那么为什么需要SSL呢？近些年来深度学习的发展十分迅速，在各个领域都有出色的表现。但就如 Yann 的比喻一样，监督学习是蛋糕上的糖衣，让人尝到了甜头，但仅仅是薄薄一层。监督学习暴露出了许多的缺陷：
- **数据集获取困难**：监督学习需要一个庞大的数据集，需要人工进行标注，但对于 low-level 任务，想要获取 GT 是非常的困难的。
- **模型泛化能力差**：由于 GT 获取困难，现在大多采用的是合成的数据集进行训练，但合成的数据集与真实数据依然存在很大的差距，这就导致训练出来的模型泛化能力非常差，技术难以落地。  

面对这些问题，所以才需要自监督学习，由于自监督学习不需要成对的数据集，所以可以直接使用真实的退化图像/视频进行训练，这能大大提高模型的泛化能力。而且自监督学习的能量远不止如此，突破了数据集的限制，它可以做的事情远超监督学习，所以 Yann 才说 “SSL is the future”。

<a name="chapter-2"></a>
## 2. Low-Level 中 SSL 如何进行监督
在许多 low-level 任务中，想要获取高质量的成对训练集是十分困难的，所以我认为 SSL 的关键在于**如何在没有成对训练集的情况下训练模型**，所以在本文中不讨论某方法是不是属于 SSL ，我把关注点放在 “**如何进行监督**” 上。

<a name="chapter-2-1"></a>
### 2.1 通过先验对重建结果进行约束
对于真实图像 x ，它的观测结果为 y ，观测的退化过程定义为 H(·) ，则图像的退化过程可以描述为： <img src="https://latex.codecogs.com/gif.latex?y=H(x)" /> 。 而图像复原的任务是找到一种退化过程的逆映射 G(·) ，即： <img src="https://latex.codecogs.com/gif.latex?x=G(y)" /> 。 很显然这个逆过程是 ill-posed 的，多以需要引入额外的约束来规范 x ，一种常见的是 MAP 方法，即通过下面的方式解出 x ： <img src="https://latex.codecogs.com/gif.latex?\tilde{x}=arg\max_xp(x|y)=arg\max_xp(y|x)p(x)" /> 。 对这个式子计算负对数，可以等价为下面的损失函数：<img src="https://latex.codecogs.com/gif.latex?\min_x&space;\{l_recons&plus;\lambda&space;l_x\}" /> ， 其中 <img src="https://latex.codecogs.com/gif.latex?l_recons" /> 为重建loss，对应着 p(y|x) ； <img src="https://latex.codecogs.com/gif.latex?l_x" />为对重建后的 x 的正则项, 对应着先验项 p(x) 。  
在 SSL 中，没有重建loss，所以一般希望通过先验项对重建结果进行约束，我整理了下面几种使用先验对重建结果进行约束的情况。

#### 2.1.1 Hand-crafted Prior based Methods
在一些传统的方法中，并不需要成对的训练集，只需要一张退化过的图像，利用提出的先验来解决图像复原的逆问题。如 Image Dehazing 任务中的 DCP(Dark Channel Prior) 方法，通过统计得到了这样的先验：“在无雾图像中局部区域存在一些像素，这些像素中至少有一个颜色通道的亮度值非常非常低（低亮度值区域不包括天空区域）”，通过这个先验，借助大气散射模型，能够很好的除天空以外区域的 Dehazing 问题。而这类方法提出的先验往往不能满足所有情况，当提出的先验失效时，此方法也就没有了效果。

#### 2.1.2 Deep Image Prior
在 “*Deep Image Prior*” 论文中，作者通过实验发现了有趣的现象：当作者训练一个生成器网络，输入一个随机噪声，去拟合一个有噪声的图片，发现当训练次数不多时，网络的输出首先会训练生成一张清晰的图片。而得到了一个结论：“卷积网络生成器会更容易学习到较为 simple 的图像，即有着**较强内在相似度**的图像”。作者将这种现象称为“DIP(Deep Image Prior)”。通过这样的方式，仅需要一张退化后的图像训练网络，便可以完成一些任务，如 Image Denosing。  

在 “*Double-DIP：Unsupervised Image Decomposition via Coupled Deep-Image-Priors*” 文章中，作者对 DIP 的方法进行了扩展，这与这样的一个模型：<img src="https://latex.codecogs.com/gif.latex?I(x)=m(x)y_1(x)+(1-m(x))y_2(x)" /> , 通过两个 DIP 网络，完成了很多 low-level 的任务，如：Segmentation、Transparent Layers Separation、Image Dehazing 。他的方法流程如下图：  
![Double-DIP](https://s1.ax1x.com/2020/04/03/Gtcswd.png)  

#### 2.1.3 GAN & Physical Model
近些年，GAN(Generative Adversarial Networks) 十分火热，由于其能够“无中生有”的特性，GAN成为了无监督学习的比价流行的方向。GAN的原理是训练一个判别器，可以判别出图像是否符合某一概率分布，通过这个判别器可以约束重建过程，使重建后的图像符合自然真实图像的分布。由于 GAN 是对重建后的图像的一种限制，相当于是一个正则项来约束图像，所以我将其归类在“通过先验对重建结果进行约束”这一类别中。  

对于Physical model，在上文提到的退化过程 <img src="https://latex.codecogs.com/gif.latex?y=H(x)" /> ，而要使重建后的 <img src="https://latex.codecogs.com/gif.latex?\tilde{x}" /> 与真实的 x 非常接近，那么重建后的 <img src="https://latex.codecogs.com/gif.latex?\tilde{x}" /> 经过退化之后也应该与观测图像 y 相符合，即可以有约束： <img src="https://latex.codecogs.com/gif.latex?Loss(y,&space;H(\tilde{x}))" /> 。

<a name="chapter-2-2"></a>
### 2.2 通过域的转换实现特征分离
一些方法考虑到以下两点：
- 想要获取成对的训练集是十分困难的，但是获取不成对(unpaired)的数据集还是可以接受的。所以有些方法想利用这样的 **unpaired** 数据集来训练模型。
- 对于许多 low-level 任务来说，在把图像从像素空间映射到特征空间时，我们希望能够进行**特征分离**，如在 Dehazing 任务中，我们希望将 hazy 特征和 haze-free 特征进行分离，仅使用 haze-free 特征来重建 dehaze 图像；在 Deblurring 任务中，我们希望把 blur 特征和 clear 特征进行分离，从而去除 blur 。  

结合这两点，通常可以将 unpaired 图像在两个域之间转换而达到特征分离的目的。  

在 “*Cycle-Dehaze: Enhanced CycleGAN for Single Image Dehazing*” 文章中，作者训练了两个生成器和两个判别器，两个生成器分别完成 hazy->clear 和 clear->hazy 的转换；两个判别器分别判定图片是否为 hazy 或 clear 。如下图：  
![CycleGAN-Dehaze](https://s1.ax1x.com/2020/04/03/Gtc2fP.png)  

在 “*Unsupervised Domain-Specific Deblurring via Disentangled Representations*” 文章中，作者训练了内容编码器、模糊编码器、加模糊解码器、去模糊编码器，将模糊图像的内容和模糊特征区分开，从而实现图像在域之间的转换；同时还对模糊编码器添加 KL 散度损失以阻止模糊编码器对内容信息进行编码。如下图：   
![Unsupervised-Deblur](https://s1.ax1x.com/2020/04/03/GtcWSf.png)  

<a name="chapter-2-3"></a>
### 2.3 从数据中挖掘信息代替 GT 进行监督
通常情况下，图像和视频中存在许多重复冗余的信息，如在图像中，总是存在一些 patch 十分相似；在视频中，连续帧之间的场景大部分是重复的，只是因为 motion 产生形变和偏移。既然图像和视频中存在这么多的冗余信息，那么这些信息便可以用来约束网络的训练。  

在 “*Noise2Noise: Learning Image Restoration without Clean Data*” 文章中，作者发现：使用上述的损失函数，在有限数量的 input-target 对上训练生成器的过程隐含了一点：input 与 target 的关系并不是一一对应的，而是一个多值映射问题。比如对于一个超分辨问题来说，对于每一个输入的低分辨图像，其可能对应于多张高分辨图像，或者说多张高分辨图像的下采样可能对应同一张图像。而在高低分辨率的图像对上，使用 L2 损失函数训练网络，网络会学习到输出所有可能结果的平均值。相对应的，使用 L1 损失函数可以学到这些可能结果的中位值，L0 损失函数可以学到众数。因此，根据这个发现，对于 L2 损失函数，如果我们用一个期望与 GT 相匹配的随机数替换目标，那么估计值 output 会保持不变，训练出来的模型是一样的。  
对于 Denoising 任务，一般是用 nosie-clean 的成对数据集进行训练，那根据上面的结论，在 clean 上增加一个 0 均值的 noise，也可以达到相同的训练效果。即使用 noise-noise 的数据集进行训练，正如论文题目 “Noise2Noise”。在实际应用过程中，仅需要“**同一场景两次独立的观测**”即可可以达到 Denoise 的效果，针对于不同的噪声类型，需要选择不同的损失函数，如，加性高斯白噪声和泊松噪声使用 L2 损失函数；乘性伯努利噪声使用 L1 损失函数；随机值脉冲噪声使用 L0 损失函数。  
这篇论文并不是在现有的数据集的冗余信息的挖掘，但这篇论文提供一了一个新的思路。  

在 “*Model-blind Video Denoising Via Frame-to-frame Training*” 文章中，作者把 Noise2Noise 的思想扩充到了视频中，因为视频中连续帧之间的场景大多数重复的，仅仅因为 motion 产生形变和偏移，作者便利用了这帧间的冗余信息，不需要成对的视频，仅需要一个含有 noise 的视频就可以实现对视频的 Denoise 。  
作者使用一个 pre-trained denoiser (DnCNN)，通过计算光流将相邻帧 warp 对齐后组成训练集，然后对 pre-trained denoiser 进行 fine-tune，可以实现在整个视频上 Denoise 的性能。为了处理遮挡情况，增强训练过程的鲁棒性，会检测光流偏大的像素，视为遮挡像素，让这些像素不参与 loss 的计算。
同时作者还给出了 off-line 和 on-line 两个算法版本。其中，off-line 使用整个视频制作数据集进行 fine-tune， 而 on-line 在视频放映过程中，仅使用前面的几帧制作训练集，随着训练集的增加，Denoise 的效果会逐渐提升。优化过程如下：   
![Frame2Frame](https://s1.ax1x.com/2020/04/03/Gtcfl8.png)  

在 “*Restore from Restored: Video Restoration with Pseudo Clean Video*” 文章中，与 Frame-to-frame 类似，作者同样使用 pre-trained denoiser。但是，为了规避光流计算不准确的问题，作者并没有使用帧和帧制作训练集，而是先使用 pre-trained denoiser 对视频进行一次 Denoise，得到一个“伪干净”的视频，然后再对这个“伪干净”的视频应用退化模型，从而组成成对的训练集，然后对 pre-trained denoiser 进行 fine-tune 。
同样，作者也给出了 off-line 和 on-line 两个算法版本：
![RestorefromRestored](https://s1.ax1x.com/2020/04/03/Gtcowj.png)  


<a name="reference"></a>
## Reference
- Single Image Haze Removal Using Dark Channel Prior
- Deep Image Prior
- “Double-DIP” : Unsupervised Image Decomposition via Coupled Deep-Image-Priors
- Physics-Based Generative Adversarial Models for Image Restoration and Beyond
- Cycle-Dehaze: Enhanced CycleGAN for Single Image Dehazing
- Unsupervised Domain-Specific Deblurring via Disentangled Representations
- Noise2Noise: Learning Image Restoration without Clean Data
- Model-blind Video Denoising Via Frame-to-frame Training
- Restore from Restored: Video Restoration with Pseudo Clean Video
