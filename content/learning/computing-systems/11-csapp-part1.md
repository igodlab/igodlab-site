---
title: CSAPP - Part I Program Structure and Execution
date: 2026-02-03
---

# 1. A Tour of Computer Systems

# 2. Representing and Manipulating Information

- Computers store and manipulate bits and thats the only thing they handle. This chapter is all about how can we represent and compute meaningful operations with bits
- Basically we can encode many meanings in a bit-system, we'll see how. Basically we have to explore
    - Encoding values to represent elements of various mathematical sets
    - Encoding instructions to perform many procedures eg. arithmetic operations, machine-level instructions, input/output

### 2.2 Integer Representations

- A computer's word size $w$ determines the default byte-sizes of many datatypes. Whereas other datatypes have either smaller (`char, short, int`) or larger (eg. `int64_t` forcing a 64-bit number in a 32-bit machine) byte-size requirements 
- There are many different ways of encoding a binary value $\vec{x}=[x_{w-1},x_{w-2}\ldots,x_0]$ (where the vector elements come to represent positional bits rather than dimensional values)
    - Notably $x_{w-1}=0(1)$ indicates if a number is positive (negative) in many representations, thus is called the *sign bit or most significant bit (MSB)* 
> [!Note] *Two's-Complement* is the dominant representation
> Below I show the formal conversion functions with its ranges. Though I find easier to memorize it by their symmetry/asymmetry characteristics. Check the second table showing the full representation values for a 4-bit number.
>
> *Unsigned* - represents positive numbers starting at zero. *Signed* - represents increasing (decreasing) positive $x_{w-1}=0$ (negative $x_{w-1}=1$) integers until it reaches its largest (smallest) value possible. *One's-complement* - symmetric with sign inversion wrt sign bit change. *Two's-complement* asymmetric, similar to one's comp. but with one negative number larger and w/o $-0$ thus is shifted by $|\text{TMin}|=|\text{TMax}|+1$

$$
\begin{array}{|c|l|l|}
\hline
\textbf{Encoding (X)} & \textbf{Function (B2X)} & \textbf{Range } \{0,1\}^w\rightarrow\{\text{XMin}_w,\ldots\text{XMax}_w \} \\
\hline
\textbf{Unsigned} & \text{B2U}_w(\vec{x}) = \sum_{i=0}^{w-1}x_i\cdot 2^i & \text{UMin}_w=\sum_{i=0}^{w-1}0\cdot 2^i,\quad\text{UMax}_w=\sum_{i=0}^{w-1}1\cdot2^i \\
\textbf{(bijective)} & & \rightarrow \{0,\ldots, 2^{w}-1\} \\
 \hline
\text{Signed} & \text{B2S}_w(\vec{x}) = (-1)^{x_{w-1}}\cdot\left(\sum_{i=0}^{w-2}x_i\cdot 2^i\right) & \text{SMin}_w=(-1)^1\cdot\left(\sum_{i=0}^{w-2}1\cdot 2^i\right),\quad\text{SMax}_w=(-1)^0\cdot\left(\sum_{i=0}^{w-2}1\cdot 2^i\right) \\
\text{(surjective)} & & \rightarrow \{-2^{w-1}+1,\ldots, 2^{w-1}-1\} \\
 \hline
\textbf{Two's-Complement} & \text{B2T}_w(\vec{x}) = -x_{w-1}\cdot 2^{w-1}+\sum_{i=0}^{w-2}x_i\cdot 2^i & \text{TMin}_w=-1\cdot 2^{w-1},\quad\text{TMax}_w=\sum_{i=0}^{w-2}1\cdot 2^i \\
\textbf{(bijective)} & & \rightarrow \{-2^{w-1},\ldots, 2^{w-1}-1\} \\
\hline
\text{One's-Complement} & \text{B2O}_w(\vec{x}) = -x_{w-1}\cdot(2^{w-1}-1)+\sum_{i=0}^{w-2}x_i\cdot 2^i & \text{OMin}_w=-1\cdot (2^{w-1}-1),\quad\text{OMax}_w=\sum_{i=0}^{w-2}1\cdot 2^i \\
\text{(surjective)} & & \rightarrow \{-2^{w-1}+1,\ldots, 2^{w-1}-1\} \\
\hline
\end{array}
$$

$$
\begin{array}{c|r|r|r|r}
\vec{x} & \text{B2U}(\vec{x}) & \text{B2S}(\vec{x}) & \textbf{B2T}(\vec{x}) & \text{B2O}(\vec{x}) \\
\hline
0000 &  0 &  0 &  \mathbf{0} &  0 \\
0001 &  1 &  1 &  \mathbf{1} &  1 \\
0010 &  2 &  2 &  \mathbf{2} &  2 \\
0011 &  3 &  3 &  \mathbf{3} &  3 \\
0100 &  4 &  4 &  \mathbf{4} &  4 \\
0101 &  5 &  5 &  \mathbf{5} &  5 \\
0110 &  6 &  6 &  \mathbf{6} &  6 \\
0111 &  7 &  7 &  \mathbf{7} &  7 \\
1000 &  8 & -0 & \mathbf{-8} & -7 \\
1001 &  9 & -1 & \mathbf{-7} & -6 \\
1010 & 10 & -2 & \mathbf{-6} & -5 \\
1011 & 11 & -3 & \mathbf{-5} & -4 \\
1100 & 12 & -4 & \mathbf{-4} & -3 \\
1101 & 13 & -5 & \mathbf{-3} & -2 \\
1110 & 14 & -6 & \mathbf{-2} & -1 \\
1111 & 15 & -7 & \mathbf{-1} & -0 \\
\end{array}
$$

- *C Promotion rules* - states that when either operand is unsigned then the other operand is implicitely cast to unsigned.
- **Sign extension** is basically padding a binary value to the left to increase its bit-size but keeping the value unchanged
    - *Unsigned*: simply pads with zeros to the left ie. $\vec{u}=[{\color{#04a5e5}0,\ldots,0},u_{w-1},u_0]$
    - *Two's-complement*: pads with the same value as the sign bit $\vec{x} = [{\color{#04a5e5}x_{w-1},\ldots,x_{w-1},},x_{w-1},x_{w-2},\ldots,x_0]$

# 3. Machine-Level Representation of Programs


