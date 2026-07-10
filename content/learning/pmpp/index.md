---
title: Flash Attention in CUDA C/C++ — Work in Progress
date: 2026-01-26
---

<img src="/static/assets/learning/pmpp/pmpp5ed-cover.jpg" width="30%">

I'm building Flash Attention from scratch in CUDA C/C++, writing highly optimized GPU kernels by hand rather than relying on existing libraries. The end goal is a fused, memory-efficient attention kernel that avoids materializing the full $N \times N$ attention matrix, computing the softmax-weighted output

$$O = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

using online softmax and tiling so that intermediate results stay resident in fast on-chip memory instead of round-tripping through global memory.

But before jumping into something as intricate as Flash Attention, we need to a solid foundation in CUDA itself — memory hierarchies, thread/block scheduling, coalescing, shared memory tiling, and kernel optimization patterns. In this spirit here are my notes and working solutions to [Programming Massively Parallel Processors 5th Edition](https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-443-43900-1). The core book for mastering *high performance compute* and GPU acceleration. The write-ups on this site are my personal notes as I go — not a polished tutorial, just my own understanding worked out in public. The working Github repository is [igodlab/pmpp](https://github.com/igodlab/pmpp).

This project will grow gradually: foundational CUDA notes first, then progressively more advanced kernels, working up toward a full Flash Attention implementation.
