---
layout: post
title: "【Knowledge Distillation】知识蒸馏学习"
subtitle:
date: 2020-05-04 17:00:00 -0400
catalog: true
background:
tags:
    - Deep-Learning
    - 知识蒸馏
---

# 【Knowledge Distillation】知识蒸馏学习

## 1. 背景与相关研究
一般来说，深度神经网络的深度越深，其拟合能力就越强，性能也就越好；而直接训练一个浅网络，很难达到深网络的效果。Caruana et al. 在 [1] 中提出了这样的问题：**复杂的任务一定需要深网络（D-Net）才能完成吗？浅网络（S-Net）否能达到深网络的效果呢？**

Caruana 通过实验证明：使用 S-Net 可以通过模拟训练好的 D-Net 来达到 D-Net的效果。并得到结论：**一个模型的复杂，不一定代表它的表达也是复杂的，即复杂的任务也可以用简单的网络学习。**

但是，Caruana 在实验过程中发现：
- 如果直接使用 D-Net 输出的 probabilities 作为 label 时，与直接用标注的 one-hot label 一样，不能让 S-Net 达到 D-Net 的效果。
- 需要使用 D-Net 最后 Softmax Layer 之前的 logits 作为 label，且使用 L2 loss，才能使 S-Net 接近 D-Net 的效果。

这是因为 logits 比 probabilities (hard label) 包含更丰富的信息，如：
- 训练好的 D-Net 在某个样本输出的 $logits=[10,20,30]$，经过 Softmax 之后的 $probabilities=[2\times10^{-9},4\times10^{-5},0.9999]$，当 S-Net 在 probabilities 上训练时，会特别关注第三个类别，而忽略前两个类别；而在 logits 上训练则可以让 S-Net 更好的关注每个类别间的关系，更容易的逼近 D-Net 行为的细节。
- 再者，当 $logits=[-10,0,10]$ 时，经过 Softmax 之后依然 $probabilities=[2\times10^{-9},4\times10^{-5},0.9999]$，与上个例子相同，在probabilities 上训练使 S-Net 无法区分这两个样本的区别。

即：**在 logits 上训练，更能让 S-Net 学习到 D-Net 的本质，因为这避免了 logits 向 probabilities 转化带来的信息熵的损失。**


## 2. 知识蒸馏的引入
在当前深度神经网络的训练和测试使用中存在这样一个矛盾：
- 在训练网络过程中，为了尽可能提升网络的性能，通常在相同的数据集上训练不同的模型，再取这些模型输出的平均值作为预测结果，即“Ensemble”。
- 在测试过程中，这样的 Ensemble 的模型存在很大的冗余，模型中每个参数附带的知识量很小，且带来了很大的计算量，对测试使用非常不友好。

Hinton 在 [2] 中使用了一个很恰当的例子：许多昆虫（以蝴蝶为例）在幼年时以毛毛虫的形态吃树叶积攒能量，长大后变成蝴蝶的形态完成迁徙和繁殖的需求。对于网络的训练和使用中，有着和蝴蝶类似的情况：
- 在训练阶段，为了尽可能获取最好的效果，算法需要从大量且高度冗余的数据中获取尽可能多的知识，这个过程不需要考虑实时性，可能付诸于庞大的计算量。这对应着蝴蝶幼年时期以毛毛虫笨拙的形态尽可能多的积攒能量。
- 在部署和使用阶段，笨重的模型带来了庞大的计算量，此时需要利用更加轻巧模型从这笨重的模型中提炼出知识，以满足部署使用时的实时性的需求。这对应着蝴蝶长大会的蜕变成蝴蝶的形态来完成迁徙和繁殖的需求。

因此，Hinton 在 [2] 中正式提出了 **知识蒸馏（Knowledge Distillation）** 的概念：是一种模型压缩方法，简称KD。该方法将已经训练好的**复杂模型**所包含的 **暗知识(Dark Knowledge)** 提取到另一个**简单模型**中去，在压缩参数量的同时也能达到相同的性能。这对应着上述例子中从毛毛虫到蝴蝶的转变。


## 3. 知识蒸馏
想要对知识进行蒸馏，首先要定义知识，一个抽象的定义是：知识是从输入到输出的映射关系。而蒸馏是把知识从笨重的模型（cumbersome model）迁移到轻巧模型（small model）的一般方法是。这需要用到 Teacher-Student 模型，即以训练好的笨重模型作为 teacher（T-Net），轻巧模型作为 student（S-Net），**其核心在于：用 T-Net 预测的 Soft-target 来辅助 Hard-target 训练 S-Net。**

### 3.1 Hard-target 和 Soft-target
![Hard-target and Soft-target](https://s1.ax1x.com/2020/05/13/YwG7CV.png)
- Hard-target：原始数据集标注的 one-shot 标签，除了正标签为 1，其他负标签都是 0。
- Soft-target：T-Net预测的结果，每个类别都分配了概率，正标签的概率最高。

**Soft-target 中的负标签同样包含 T-Net 归纳推理的信息**，如某个负标签的概率比其他负标签要高，则代表 T-Net 在推理时认为该样本与该负标签有一定的相似性。如在 MNIST 数据集中，某个输入“2”形似“3”，则在 Soft-target 中分配给“3”的概率会比其他负标签类别高；而另一个“2”更形似“7”，则这个样本分配给“7”的概率会比其他负标签类别高。

![Soft-target contains more information](https://s1.ax1x.com/2020/05/13/YwJ1Kg.png)

这些信息，在使用 Soft-target 训练时，S-Net 可以很快学习到 T-Net 的推理过程；而传统的 Hard-target 的训练方式，所有的负标签都会被平等对待。可见，Soft-target 给 S-Net 带来的信息量要大于 Hard-target。

同时，使用 Soft-target 训练时，梯度的方差会更小，训练时可以使用更大的学习率，所需要的样本也更少。

### 3.2 具体方法
神经网络使用 Softmax 层来实现 logits 向 probabilities 的转换，为了实现知识蒸馏，在 Softmax 公式基础上引入温度 T：

$$q_i=\frac{exp(z_i/T)}{\sum_j exp(z_j/T))}$$

其中 $q_i$ 是每个类别输出的概率，$z_i$ 是每个类别输出的 logits，当温度 $T=1$ 时，这就是标准的 Softmax 公式。

知识蒸馏训练的具体方法主要包括以下几个步骤：
1. 训练好 T-Net；
2. 利用高温 $T_{high}$ 产生 Soft-target；
3. 使用 {Soft-target，$T_{high}$} 和 {Hard-target，$T=1$} 同时训练 S-Net；
4. 设置温度 $T=1$ 测试 S-Net。

在 步骤3 中，使用 Soft-target 监督训练时，需要设置与 步骤2 中同样的高温 $T_{high}$；使用 Hard-target 监督训练时需设置温度 $T=1$。具体的 Loss 函数如下：

$$L=\alpha L_{soft}+\beta L_{hard}$$

其中 $\alpha$ 和 $\beta$ 是两个 loss 的权重，$L_{soft}$ 和 $L_{hard}$ 是分别是用 Soft-target 和 Hard-target 监督的 loss。使用 Hard-target 监督的是有必要的，因为 Soft-target 也有预测错误的可能，所以需要 Hard-target 来进行一定的校正。

对于 $L_{soft}$，将训练样本输入 T-Net 使用高温 $T_{high}$ 产生 Soft-target，S-Net 在同样高温 $T_{high}$ 下 Softmax 的输出与 Soft-target 做交叉熵，具体如下：

$$L_{soft}=-\sum_i p_i log(q_i), where: p_i=\frac{exp(v_i/T_{high})}{\sum_j exp(v_j/T_{high}))}, q_i=\frac{exp(z_i/T_{high})}{\sum_j exp(z_j/T_{high}))}$$

其中 $v_i$ 和 $z_i$ 分别是 T-Net 和 S-Net 输出的 logits，$p_i$ 和 $q_i$ 分别是 T-Net 和 S-Net 在高温 $T_{high}$ 下 Softmax 的输出。

对于 $L_{hard}$，S-Net 在同样高温 $T=1$ 下 Softmax 的输出与 ground-truth 做交叉熵，具体如下：

$$L_{hard}=-\sum_i c_i log(q_i^1)$$

其中 $c_i$ 是 ground-truth 的 label，$q_i^1$ 是 S-Net 在$T=1$ 下 Softmax 的输出。


## 4. 讨论

### 4.1 Distillation 和 Match Logits
Caruana et al. 在 [1] 中使用 Match Logits 的方式对知识进行迁移，其实 Match Logits 是 Distillation 的一种特殊形式，当 $T\rightarrow \infty$ 时，Distillation 可以近似为 Match Logits。

**首先看 Match Logits**，使用的是 L2 loss，即最小化目标函数 $L_{logits}=\frac{1}{2} (z_i-v_i)^2$，对 $z_i$ 求梯度可得：

$$\frac{\partial L_{logits}}{\partial z_i}=z_i-v_i$$

**再看 Distillation**，$L_{soft}$ 对 $z_i$ 求梯度可得：

$$\frac{\partial L_{soft}}{\partial z_i}=\frac{1}{T}(q_i-p_i)=\frac{1}{T}(\frac{exp(z_i/T)}{\sum_j exp(z_j/T)}-\frac{exp(v_i/T)}{\sum_j exp(v_j/T)})$$

当 $T\rightarrow \infty$ 时，有 $z_i/T\rightarrow 0$ 和 $v_i/T\rightarrow 0$，根据泰勒公式的一阶展开，当 $x\rightarrow 0$ 时有 $exp(x)\rightarrow x+1$，则有：

$$\frac{\partial L_{soft}}{\partial z_i}\approx \frac{1}{T}(\frac{1+z_i/T}{N+\sum_j z_j/T}-\frac{1+v_i/T}{N+\sum_j v_j/T})$$

此时，假设 Logits 在每个样本上是零均值的，则进一步近似：

$$\frac{\partial L_{soft}}{\partial z_i}\approx \frac{1}{NT^2}(z_i-v_i)$$

可见，Distillation 和 Match Logits 的 Loss 函数在 $T\rightarrow \infty$ 时是等价的，即 **Match Logits 是 Distillation 的一种特殊形式。**

### 4.2 Hard-target 和 Soft-target 的权重
关于 $L_{soft}$ 和 $L_{hard}$ 的权重，实验发现，当 $L_{hard}$ 权重较小时，能产生最好的效果，这是一个经验性的结论，可以近似通过下面的比较来分析，$L_{soft}$ 和 $L_{hard}$ 分别对 $z_i$ 求梯度：

$$\frac{\partial L_{soft}}{\partial z_i}=\frac{1}{T}(\frac{exp(z_i/T)}{\sum_j exp(z_j/T)}-\frac{exp(v_i/T)}{\sum_j exp(v_j/T)})$$

$$\frac{\partial L_{hard}}{\partial z_i}=\frac{exp(z_i)}{\sum_j exp(z_j)}-c_i$$

可以这样进行近似：

$$\frac{exp(z_i)}{\sum_j exp(z_j)} \approx \frac{T \cdot exp(z_i/T)}{\sum_j exp(z_j/T)}$$

这样可以认为，$L_{soft}$ 贡献的梯度大约为 $L_{hard}$ 的 $\frac{1}{T^2}$，所以一般在 $L_{soft}$ 的权重上乘以 $T^2$，以保证 Soft-target 和 Hard-target 的贡献大致相同，即：

$$L=T^2 \cdot L_{soft}+\beta L_{hard}$$


### 4.3 关于温度
在知识蒸馏中，需要使用高温将知识“蒸馏”出来，但是如何调节温度 $T$ 呢，温度的变化会产生怎样的影响呢？

![T increase](https://s1.ax1x.com/2020/05/13/YwtujS.png)

温度 $T$ 有这样几个特点：
- 当 $T\rightarrow 0$ 时，Softmax 的输出值会接近于 Hard-target；
- 随着 $T$ 的增加，Softmax 的输出分布越来越平缓，信息熵会越来越大；

温度 $T$ 的高低影响着 S-Net 在训练过程中对负标签的关注程度: 随着温度的升高，负标签相关的值会相对增大，S-Net 会跟多的关注负标签。

所以，温度 $T$ 的调节策略应为：
- 当想从负标签中学到一些信息量的时候，温度 $T$ 应调高一些；
- 当想减少负标签的干扰的时候，温度 $T$ 应调低一些；


## 5. 扩展与应用

此外，还有很多论文在知识蒸馏上作出了探索和应用，先列出一些论文，后续对这些论文进行总结：
- 在论文 [3] 中，不仅让 S-Net 模仿 T-Net 的输出，还使用 T-Net 中间层的 feature map 对 S-Net 中间层进行约束。
- 在论文 [4] 中，对 [3] 进行了优化，用 attention map 代替 feature map 对 S-Net 中间层进行约束。
- 在论文 [5] 中，针对语义分割任务提出了结构化的蒸馏方式，不仅使用 pixel-wise distillation，还提出了 pair-wise distillation 和 holistic distillation



## Reference
[1] 【NIPS2014】 Do Deep Nets Really Need to be Deep?  
[2] 【NIPS2015】 Distilling the Knowledge in a Neural Network  
[3] 【ICLR2015】 FITNETS：Hints for Thin Deep Nets  
[4] 【ICLR2017】 Paying More Attention to Attention: Improving the Performance of Convolutional Neural Networks via Attention  
[5] 【CVPR2019】 Structured Knowledge Distillation for Semantic Segmentation  
[6] 【知乎】 https://zhuanlan.zhihu.com/p/102038521
