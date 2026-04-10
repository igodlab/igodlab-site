---
title: CSAPP - Part I Program Structure and Execution
date: 2026-02-03
---

# 1. A Tour of Computer Systems

# 2. Representing and Manipulating Information

- Computers store and manipulate bits and thats the only thing they handle. This chapter is all about how can we represent and compute meaningful operations with bits
- Basically we can encode many meanings in a bit-system, we'll explore:
    - Encoding values to represent elements of various mathematical sets
    - Encoding instructions to perform many procedures eg. arithmetic operations, machine-level instructions, input/output

### 2.2 Integer Representations

- A computer's word size $w$ determines the default byte-sizes of many datatypes. Whereas other datatypes have either smaller (`char, short, int`) or larger (eg. `int64_t` forcing a 64-bit number in a 32-bit machine) byte-size requirements 
- There are many different ways of encoding a binary value $\vec{x}=[x_{w-1},x_{w-2}\ldots,x_0]$ (where the vector elements come to represent positional bits rather than dimensional values)
    - Notably $x_{w-1}=0(1)$ indicates if a number is positive (negative) in many representations, thus is called the *sign bit or most significant bit (MSB)* 

> [!Important] *Two's-Complement* is the dominant representation
> Below I show the formal conversion functions with its ranges. Though I find easier to memorize it by their symmetry/asymmetry characteristics. Check the second table showing the full representation values for a 4-bit number.
>
> The intuition for each representaiton is basically:
> - *Unsigned* - represents positive numbers starting at zero
> - *Signed* - represents increasing (decreasing) positive $x_{w-1}=0$ (negative $x_{w-1}=1$) integers until it reaches its largest (smallest) value possible
> - *One's-complement* - symmetric with sign inversion wrt sign bit change
> - *Two's-complement* asymmetric, similar to one's comp. but with one negative number larger and w/o $-0$ thus is shifted by $\lvert\text{TMin}\rvert=\lvert\text{TMax}\rvert+1$

$$
\begin{array}{|c|l|l|}
\hline
\textbf{Encoding (X)} & \textbf{Function (B2X)} & \textbf{Range } \{0,1\}^w\rightarrow\{\text{XMin}_w,\ldots\text{XMax}_w \} \\
\hline
\text{Unsigned} & \text{B2U}_w(\vec{x}) = \sum_{i=0}^{w-1}x_i\cdot 2^i & \text{UMin}_w=\sum_{i=0}^{w-1}0\cdot 2^i,\quad\text{UMax}_w=\sum_{i=0}^{w-1}1\cdot2^i \\
\text{(bijective)} & & \rightarrow \{0,\ldots, 2^{w}-1\} \\
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
1111 & 15 & -7 & \mathbf{-1} & -0 
\end{array}
$$

- Naturally there are conversion functions that allow us to go from one representation to another (w/o passing through binary)
    - **Two's-complement to unsigned** - for $x\in \text{TMin}_w \leq x \leq \text{TMax}_w$
    $$
    \text{T2U}_w(x) = 
    \begin{cases}
    x + 2^w, & x < 0 \\
    x, & x \geq 0
    \end{cases}
    $$
    - **Unsigned to Two's-complement** - for $u\in0\leq u \leq \text{UMax}_w$
    $$
    \text{U2T}_w(u) = 
    \begin{cases}
    u, & u \leq \text{TMax}_w \\
    u - 2^w, & u > \text{TMax}_w
    \end{cases}
    $$


> [!Important] Computers only manipulate bits
> 
> The key thing to understand is that values, operands, instructions and math that our programs manipulate and run are all sequences of bits. It is our job to understand how computers interpret these bits for us to avoid errors!
> 
> Writing correct programs involve a holistic understanding of how programs will instruct the computer to handle bits. For instance, the same sequence of bits can mean: an *operand instruction* or a *floating point value* of a bunch of *characters*. Thus, we must be aware that the language-compiler can command the correct way of treating bits according to our program's purpose. 

- In the spirit of exemplifying that *"bits are the same we simply instruct how to interpret them"* we have some techniques for shortening or enlarging them
    - **Sign extension** is basically padding a binary value to the left to increase its bit-size but keeping the value unchanged
        - *Unsigned* -  simply pads with zeros to the left ie. $\vec{u}=[{\color{#04a5e5}0,\ldots,0},u_{w-1},u_0]$
        - *Two's-complement* - pads with the same value as the sign bit $\vec{x} = [{\color{#04a5e5}x_{w-1},\ldots,x_{w-1},},x_{w-1},x_{w-2},\ldots,x_0]$
    - **Truncating numbers** of $w$-bits to $k$-bits ($w>k$) is accomplished by dropping the high order $(w-k)$-bits. Truncation occurs when casting is applied to a value

### 2.3 Integer Arithmetic

There are a few caveats to understand binary arithmetic. For instance since our values are represented by finite $w$-bit numbers we must deal with **overflow**

- **Unsigned addition** for arguments $x,y$, where $0\leq x,y \leq 2^w - 1$ their sum is in range $0 \leq x + y \leq 2^{w+1}-2$
$$
x +_w^U y = 
\begin{cases}
x + y, & x + y \leq \text{UMax}_w & \text{(Normal)} \\
x + y - 2^w, & \text{UMax}_w < x + y < 2^{w+1} & \text{(Overflow)}
\end{cases}
$$


- **Unsigned negation** is obtained by negating a binary number with the operator 
$$
-_w^U x = 
\begin{cases}
x, & x=0 \\ 
2^w - x, & x > 0 
\end{cases}
$$

- **Unsigned multiplication** will be in the range $0 \leq x\cdot y \leq (2^w - 1)^2$ and is determined by 
$$
x\ast_w^U  y = (x\cdot y)\mod 2^w
$$  

- **Two's-complement addition** given the integers $x,y$ in range $-2^{w-1}\leq x,y \leq 2^{w-1}-1$ their sum is in range $-2^w \leq x+y \leq 2^w - 2$
$$
x +_w^T y = 
\begin{cases}
x + y - 2^w, & \text{TMax}_w < x+y & \text{(Positive overflow)} \\
x + y, & \text{TMin}_w\leq x + y \leq \text{TMax}_w & \text{(Normal)} \\
x + y + 2^w, & x + y < \text{TMin}_w & \text{(Negative overflow)}
\end{cases}
$$

> [!Note] Detecting Overflow
> - **Unsigned**: let $s=x +_w^U y$, where $0\leq x,y \leq \text{UMax}_w$. Then $s$ overflows iif $s<x$ (or equivalently $s<y$)
> - **Two's-complement**: let $s=x +_w^T y$, where $\text{TMin}_w\leq x,y \leq \text{TMax}_w$ then $s$ exhibits:
>   - *positive overflow* iif $x>0\text{ and } y>0\text{ but }s\leq 0$ 
>   - *negative overflow* iif $x<0\text{ and }y<0\text{ but }s\leq 0$

- **Two-s-complement negation** 
$$
-_w^Tx =
\begin{cases}
\text{TMin}_w, & x = \text{TMin}_w \\
-x, & x > \text{TMin}_w
\end{cases}
$$

- **Two's-complement multiplication** - ranges between $-2^{w-1}\cdot(2^{w-1}-1)\leq x\cdot y \leq -2^{w-1}\cdot (-2^{w-1})$
$$
\ast_w^T = \text{U2T}_w\left((x\cdot y) \mod 2^w\right)
$$

---

- **Multiplying by a constant** - let's begin with multiplication by powers of 2 and then generalize to arbitrary constants
    - **Multiplication by a power of 2** - let $\vec{x}=[x_{w-1},x_{w-2},\ldots,x_0]$ be an unsigned integer. Then $\forall k \in 0 \leq k < w$, the $(w+k)$-bit unsigned representation of $x\cdot 2^k$ is given by $[x_{w-1-k},x_{w-2-k},\ldots,x_0,{\color{#04a5e5}0,\ldots,0}]$
        - where $x$ is padded with $k$ zeros to the right irrespective if we're dealing with signed or unsigned values because padding is the same for left-shift
    - **Unsigned multiplication by a power of 2** - the expression `x << k` yields the value $x\ast_w^U 2^k$
    - **Two's-complement multiplication by a power of 2** - likewise `x << k` yields $x\ast_w^T 2^k$
    - > [!Note] Multiplying by an arbitrary constant
      > The compiler finds ways for efficiently multiplying by arbitrary constants making use of patterns eg. decomposing a multiplication into left shifts and sums.

- **Division** - uses the right-shift operator as oppossed to multiplication's left-shift. The other difference is that division always rounds the result towards zero for which we'll use the *floor* $\lfloor x\rfloor$/ *ceil* $\lceil x\rceil$ notation to indicaterounding down or up, respectively. With that in mind:
    - **Unsigned division by a power of 2** - for unsigned values $u,k$ such that $0\leq k \leq w$ the **logical right shift** `u >> k` yields $\lfloor u/2^k \rfloor$ thus performing the bit-shift: $[{\color{#04a5e5}0,\ldots,0,}u_{w-1},u_{w-2},\ldots,u_k]$
    - **Two's complement division by a power of 2** - for the two's-complement values $x$ and unsigned $k$ such that $0\leq k < w$ yields $x/2^k$, performing the bit-shift: $[{\color{#04a5e5}x_{w-1},\ldots,x_{w-1},}x_{w-1},x_{w-2},\ldots,x_k]$ with two sub-cases for rounding:
        - *rounding down* - the **arithmetic right shift** `x >> k` yields $\lfloor x/2^k\rfloor$
        - *rounding up* - the **arithemtic right shift** `(x + (1 << k) - 1) >> k` yields $\lceil x/2^k\rceil$

### 2.4 Floating Point

- We can represent floating numbers using a digit notation with weights:
$$
b=\sum_{i=-n}^m b_i\times 2^i
$$

- **IEEE 754 Floating-Point Representation** - express a floating value $V=(-1)^s\times M \times 2^E$ with less precision digits but greater range using **normalized** and **denormalized** conventions:

$$
\begin{align*}
N^{\text{norm}} &= (-1)^s \times 1.\texttt{fraction}_n\times 2^{\texttt{exponent}_k - \text{bias}_k} \\
N^{\text{denorm}} &= (-1)^s \times 0.\texttt{fraction}_n\times 2^{00\cdots 0 -\text{bias}_k}
\end{align*} \\
$$
$$
\begin{array}{c||c|c|c|}
 \text{precision} & \leftarrow s\rightarrow & \leftarrow\texttt{exponent}_k\rightarrow & \leftarrow\texttt{fraction}_n\rightarrow \\
\hline
\hline
\text{double (64-bit)} & \text{1-bit} & \text{11-bits} & \text{52-bits} \\
\text{single (32-bit)} & \text{1-bit} & \text{8-bits} & \text{23-bits} \\
\text{half (16-bit)} & \text{1-bit} & \text{5-bits} & \text{10-bits} \\
\end{array}
$$

- where
    - $s$: encodes the sign 
    - $M=0/1.\texttt{fraction}$: is the $\texttt{fraction}_n\text{ or }\texttt{mantissa}_n$ part which takes $n$ unisgned bits for precision after the floating point
    - $E=\texttt{exponent}_k - \text{bias}_k$: takes $k$ unsigned bits for the range, where ($1\leq \texttt{exponent}_k\leq 2^k - 2$ and $\text{bias}_k = 2^{k-1}-1)$
        - excluding $\texttt{exponent}_k = 00\cdots 0$ and $11\cdots 1$ which are reserved for *denormalized numbers* and $\pm$infinity $(-1)^s \infty$, respectively see Fig 2.33)
        - *Denormalized* convention allows to squeeze in more values around zero
        - > [!Note] Why is a *bias* needed in the exponent?
          > 
          > Because that way we have a smooth bit incremet transition from zero to denormalized to normal to infinity values as seen in Fig 2.36

<img src="/static/assets/learning/computing-systems/Fig2_33.png" width="65%">

- The largest and smallest numbers that can be represented for a single precision number is:

$$
\begin{align*}
N^{\text{norm}}_{\text{smallest}} &= 1.00000000000000000000000_2\times 2^{-126} && (1.1755 \times 10^{-38}\text{ decimal}) \\
N^{\text{norm}}_{\text{largest}} &= 1.11111111111111111111111_2\times 2^{127} \\
&= (1\cdot 2^0 + 1\cdot 2^{-1} + 1\cdot 2^{-2} + \ldots + 1\cdot 2^{-23}) \times 2^{127} \\
&= (2-\epsilon) \times 2^{127} && (3.4028 \times 10^{38} \text{ decimal}) \\
\hline
N^{\text{denorm}}_{\text{smallest}} &= 0.00000000000000000000001_2 \times 2^{-126} \\
&= \epsilon \times 2^{-126} && (1.4013 \times 10^{-45}\text{ decimal}) \\
N^{\text{denorm}}_{\text{largest}} &= 0.11111111111111111111111_2 \times 2^{-126} \\
&= (1\cdot 2^{-1} + 1\cdot 2^{-2} + \ldots + 1\cdot 2^{-23}) \times 2^{-126} \\
&= (1-\epsilon) \times 2^{-126} && (1.1755 \times 10^{-38}\text{ decimal}) \\
\end{align*}
$$

<img src="/static/assets/learning/computing-systems/Fig2_36.png" width="85%">

---

- **Rounding** - since floating numbers live unevenly along the $\mathbb{R}$ axis we must bake-in a mechanism to round to the closest IEEE floating number

# 6. The Memory Hierarchy

- Real numbers $\mathbb{R}$



