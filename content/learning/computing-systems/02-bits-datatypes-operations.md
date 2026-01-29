---
title: LC-3 Ch2 solutions - Bits, datatypes and operations
date: 2025-11-17
---

- 2.1 Given $n$ bits, how many distinct combinations of the $n$ bits exist? 

*Ans.-* $2^n$

---

- 2.2 There are 26 characters in the alphabet we use for writing English. What is the least number of bits needed to give each character a unique bit pattern? How many bits would we need to distinguish between upper and lowercase versions of all 26 characters?

*Ans.-* The minimum bits required to represent all the 26 (52) alphabet characters is a 5-bit (6-bit) system.

---

- 2.3
    - a. Assume that there are about 400 students in your class. If every student is to be assigned a unique bit pattern, what is the minimum number of bits required to do this?
    - b. How many more students can be admitted to the class without requiring additional bits for each student’s unique bit pattern?

*Ans.-* 

- a. $2^b\geq 400\rightarrow b\geq \log_2 400 = 8.64\approx 9$ so that makes $2^9=512$ unique possibilities.
- b. We can admit $112$ extra students without requiring additional bits.

---

- 2.4 Given n bits, how many unsigned integers can be represented with the $n$ bits? What is the range of these integers?

*Ans.-* We can represent $[0,2^n-1]$ (closed) integers.

---

- 2.5 Using five bits to represent each number, write the representations of 7 and -7 in 1’s complement, signed magnitude, and 2’s complement integers.

*Ans.-*

| dec | 1's comp. | signed mag. | 2's comp. |
|---|---|---|---|
| `7`   | `00111` | `00111` | `00111` | 
| `-7`  | `11000` | `10111` | `11001` | 

---

- 2.6 Write the six-bit 2’s complement representation of -32.

*Ans.-* Lets first check the range of signed integers that can be represented with 6-bits $[-2^{n-1},2^{n-1}-1]=[-32,31]$, so this means that -32 only exists in 2's complement, and can be obtained by overflowing 31 in binary. So, since 31 is the largest positive number for 6-bit we know that the left-most digit is `0` and the rest are ones: `31 = 011 111` so `-32 = 31 + 1 = 011 111 + 000 001 = 100 000`. Alternatively, we can also get there by considering the 1's complement of `-31 = 100 000` which in 2's complement is equal to `-32`.

---

- 2.7 Create a table showing the decimal values of all four-bit 2’s complement numbers.

*Ans.-* The range of signed values we can represent is $[-2^{n-1},2^{n-1}-1]=[-8,7]$

$$
\begin{array}{r|r|r}
\texttt{4-bit} & \texttt{uns.} & \texttt{2's} \\
\hline
0000 & 0 & 0 \\
0001 & 1 & 1 \\
0010 & 2 & 2 \\
0011 & 3 & 3 \\
0100 & 4 & 4 \\
0101 & 5 & 5 \\
0110 & 6 & 6 \\
0111 & 7 & 7 \\
1000 & 8 & -8 \\
1001 & 9 & -7 \\
1010 & 10 & -6 \\
1011 & 11 & -5 \\
1100 & 12 & -4 \\
1101 & 13 & -3 \\
1110 & 14 & -2 \\
1111 & 15 & -1 \\
\end{array}
$$

---

- 2.8
    - a. What is the largest positive number one can represent in an eight-bit 2’s complement code? Write your result in binary and decimal.
    - b. What is the greatest magnitude negative number one can represent in an eight-bit 2’s complement code? Write your result in binary and decimal.
    - c. What is the largest positive number one can represent in $n$-bit 2’s complement code?
    - d. What is the greatest magnitude negative number one can represent in n-bit 2’s complement code?

*Ans.-*

- a. $2^{8-1}-1=127$ which expressed in binary is the largest positive (last leftmost `0`) number `0111 1111`
- b. $-2^{8-1}=-128$ which is the first negative (first leftmost `1`) binary number `1000 0000`
- c. $2^{n-1}-1$
- d. $-2^{n-1}$

---

- 2.9 How many bits are needed to represent Avogadro’s number $(N_A=6.02 \times 10^{23})$ in 2’s complement binary representation?

*Ans.-* In 2's complement representation we need $2^{(n-1)}-1\geq N_A\rightarrow n-1 \geq \log_2{N_A} = 78.994 \approx 79 \rightarrow n = 80$

---

- 2.10 Convert the following 2’s complement binary numbers to decimal.
    - a. `1010`
    - b. `01011010`
    - c. `11111110`
    - d. `0011100111010011`

*Ans.-*

- a. Leftmost digit is `1` so number is negative and its 2's complement positive representation is `0101 + 0001 = 0110`
$$
\begin{align*}
0110 &= -(0\cdot 2^3 + 1\cdot 2^2 + 1\cdot 2^1 + 0\cdot 2^0) \\
&= -6
\end{align*}
$$

- b. Leftmost digit is `0` so its positive and rightmost digit is `0` so its an even number
$$
\begin{align*}
01011010 &= 0\cdot 2^7 + 1\cdot 2^6 + 0\cdot 2^5 + 1\cdot 2^4 + 1\cdot 2^3 + 0\cdot 2^2 + 1\cdot 2^1 + 0\cdot 2^0 \\
&= 64+16+8+2 = 90
\end{align*}
$$

- c. Negative number. Its 2's complement positive representation is `0000 0010` which corresponds to $-2$
- d. Positive and odd number, it is $14803$

---
- 2.11 Convert these decimal numbers to eight-bit 2’s complement binary numbers.
    - a. $102$
    - b. $64$
    - c. $33$
    - d. $-128$
    - e. $127$

*Ans.-* Recall that the range of possible numbers that can be represented with 8-bits is $[-128,127]$
- a. Expanding the number in positional 8-bits:
$$
\begin{align*}
102 &= b_7\cdot 2^7 + b_6\cdot 2^6 + b_5\cdot 2^5 + b_4\cdot 2^4 + b_3\cdot 2^3 + b_2\cdot 2^2 + b_1\cdot 2^1 + b_0\cdot 2^0 \; && \text{positive \& even: }b_7=0,b_0=0//(2^{-1}) \\
51 &= b_6\cdot 2^5 + b_5\cdot 2^4 + b_4\cdot 2^3 + b_3\cdot 2^2 + b_2\cdot 2^1 + b_1\cdot 2^0 \; && \text{odd: }b_1=1,//-1\&(2^{-1}) \\
25 &= b_6\cdot 2^4 + b_5\cdot 2^3 + b_4\cdot 2^2 + b_3\cdot 2^1 + b_2\cdot 2^0 \; && \text{odd: }b_2=1,//-1\&(2^{-1}) \\
12 &= b_6\cdot 2^3 + b_5\cdot 2^2 + b_4\cdot 2^1 + b_3\cdot 2^0 \; && \text{even: }b_3=0,//(2^{-1}) \\
6 &= b_6\cdot 2^2 + b_5\cdot 2^1 + b_4\cdot 2^0 \; && \text{even: }b_4=0,//(2^{-1}) \\
3 &= b_6\cdot 2^1 + b_5\cdot 2^0 \; && \text{odd: }b_5=1,//-1\&(2^{-1}) \\
1 &= b_6 \; \\
\rightarrow 102 &= 0110\;0110
\end{align*}
$$
- b. Easy, we know that we can represent it in one power of 2 exponent $64=2^6$ therefore only $b_6=1$ and the others are zeros so: `0100 0000`
- c. We can save time by calculating instead $32+1=2^5+1$ in binary, so `0010 0000 + 0000 0001 = 0010 0001`
- d. Its the lowest bound of our 8-bit representation so: `1000 0000`
- c. Its the highest bound of our 8-bit representation so: `0111 1111`

---

- 2.12 If the last digit of a 2’s complement binary number is 0, then the number is even. If the last two digits of a 2’s complement binary number are `00` (e.g., the binary number `01100`), what does that tell you about the number?

*Ans.-* It also tells us that its divisible by $4=2^2$.

---

- 2.13 Without changing their values, convert the following 2’s complement binary numbers into eight-bit 2’s complement numbers.
    - a. `1010`
    - b. `011001`
    - c. `1111111000`
    - d. `01`

*Ans.-* Recall that we can pad with zeros (ones) to the left until we get eight digits for a positive (negative) number

- a. `1111 1010`
- b. `0001 1001`
- c. `1111 1000`
- d. `0000 0001`

---
- 2.14 Add the following bit patterns. Leave your results in binary form.
    - a. `1011 + 0001`
    - b. `0000 + 1010`
    - c. `1100 + 0011`
    - d. `0101 + 0110`
    - e. `1111 + 0001`

*Ans.-*

- a. `1100`
- b. `1010`
- c. `1111`
- d. `1011`
- e. `0000`

---

- 2.15 It was demonstrated in Example 2.5 that shifting a binary number one bit to the left is equivalent to multiplying the number by 2. What operation is performed when a binary number is shifted one bit to the right?

*Ans.-* Multiplication by $2^{-1}$

---

- 2.16 Write the results of the following additions as both eight-bit binary and decimal numbers. For each part, use standard binary addition as described in Section 2.5.1.
    - a. Add the 1’s complement representation of $7$ to the 1’s complement representation of $-7$.
    - b. Add the signed magnitude representation of $7$ to the signed magnitude representation of $-7$.
    - c. Add the 2’s complement representation of $7$ to the 2’s complement representation of $-7$.

*Ans.-* The 8-bit binary for `7 = 0000 0111` in all representations. Its negative in: 2's `-7 = 1111 1001` (invert `7` and add 1); 1's `-7 = 1111 1000` (just invert `7`) and magnitude `-7 = 1000 0111` (seventh number after overflow) representations. Because we're operating among different representations, parts a, b need **special arithmetic rules**. Remember the *special signed addition rules*: *(i)* if signs are the same add the magnitudes and keep the sign. *(ii)* if signs are different substract the smaller magnitude from the larger magnitude, keep the sign of the larger magnitude. 

- a. Add magnitudes `1111 1111` and keep the sign. This yields `-0` decimal.
- b. We have different signs so we keep the sign of +7 (`0`) and substract the magnitude, which yields `0000 0000`. Equivalent to `+0` decimal.
- c. `0000 0000` by definition its the zero decimal

---

- 2.17 Add the following 2’s complement binary numbers. Also express the answer in decimal.
    - a. `01 + 1011`
    - b. `11 + 01010101`
    - c. `0101 + 110`
    - d. `01 + 10`

*Ans.-* Because we're operating only with 2's complement representations normal binary arithmetic applies

$$
\begin{array}{l|r|r|r|r}
 & (a) & (b) & (c) & (d) \\
\hline
                       &   1011 &   1111 1111 &   0101 &   01 \\
\texttt{operation}     & + 0001 & + 0101 0101 & + 1110 & + 10 \\
\hline
\texttt{binary result} &   1100 &   0101 0100 &   0011 &   11 \\
\hline
\texttt{decimal result} & -4 & 84 & 3 & -1
\end{array}
$$


---

- 2.18 Add the following unsigned binary numbers. Also, express the answer in decimal.
    - a. `01 + 1011`
    - b. `11 + 01010101`
    - c. `0101 + 110`
    - d. `01 + 10`

*Ans.-* Unsigned numbers are all positives ie. padd w/ zeros

$$
\begin{array}{l|r|r|r|r}
 & (a) & (b) & (c) & (d) \\
\hline
                       &   0011 &   0000\;0011 &   0101 &   01 \\
\texttt{operation}     & + 0001 & + 0101\;0101 & + 0110 & + 10 \\
\hline
\texttt{binary result} &   0100 &   0101\;1000 &   1011 &   11 \\
\hline
\texttt{decimal result} & 4 & 88 & 11 & 3
\end{array}
$$

---

2.19 Express the negative value $-27$ as a 2’s complement integer, using eight bits. Repeat, using 16 bits. Repeat, using 32 bits. What does this illustrate with respect to the properties of sign-extension as they pertain to 2’s complement representation?

*Ans.-* Consider that the minimum number of bit decimal places needed to represent -27 is 6 ie. $[-32,31]$ so any larger bit representations will just padd ones (because -27 is negative)

$$
\begin{array}{l|r}
\texttt{decimal} & -27 \\
\texttt{8-bit} & 1110\;0101 \\
\texttt{16-bit} & 1111\;1111\;1110\;0101 \\
\texttt{32-bit} & 1111\;1111\;1111\;1111\;1111\;1111\;1110\;0101 
\end{array}
$$

---

- 2.20 The following binary numbers are four-bit 2’s complement binary numbers. Which of the following operations generate overflow? Justify your answer by translating the operands and results into decimal.
    - a. `1100 + 0011`
    - b. `1100 + 0100`
    - c. `0111 + 0001`
    - d. `1000 - 0001`
    - e. `0111 + 1001`

*Ans.-* Range of 4-bit numbers is $[-8,7]$
- a. Doesn't overflow. `1111 = -1` and is the upper bound binary number that can be represented. Essentially we're adding $-4+3=-1$
- b. Doesn't overflow. We are adding the same magnitude with opposite signs, carry is ignored past 4 digits and yields `0000 = 0` . We're adding $-4+4=0$
- c. Overflows. The carry takes up the signed digit place, resulting in `1000 = -8` . The sum $7+1=8$ is too large for the 4-bit 2's representation range.
- d. Overflows. Convert `- 0001 = 1111` now the result is `1000 + 1111 = 0111 = 7` (two negative operands result in a positive?) or in decimal $-8-1=-9$, which exceeds the representation range.
- e. Doesn't overflow. Carry is ignored past 4 digits and by definition the result is `0000 = 0` or $7+(-7)=0$

---

2.21 Describe what conditions indicate overflow has occurred when two 2’s complement numbers are added.

*Ans.-* When addding two positive operands (both have leftmost digit `0`) result in a negative binary number (lefmost `1`) or the inverse ie. adding two negative operands (both lefmost are `1`) and yield a positive (leftmost `0`).

---

- 2.22 Create two 16-bit 2’s complement integers such that their sum causes an overflow.

*Ans.-* Lets go for the easy examples - overflow both upper and lower bounds $[-32768, 32767]$ ie.
- (1) largest positive plus one: `0111 1111 1111 1111 + 0000 0000 0000 0001 = 1000 0000 0000 0000` (equivalent to $32767 + 1$ but due to overflow results in $-32768$ rather than $32768$). 
- (2) smallest negative minus one: `1000 0000 0000 0000 + 1111 1111 1111 1111 = 0111 1111 1111 1111` (which is $-32768 +(-1)$ but due to overflow yields $32767$ rather than $-32769$).

---

- 2.23 Describe what conditions indicate overflow has occurred when two unsigned numbers are added.

*Ans.-* When adding two unsigned operands yield a carry out of the leftmost bits ie. the carry 'is carried out' past our $n$-bit digit.

---

- 2.24 Create two 16-bit unsigned integers such that their sum causes an overflow.

*Ans.-* 
- (1) Upper bound plus one: `1111 1111 1111 1111 + 0000 0000 0000 0001 = 0000 0000 0000 0000` (+carry past 16th digit) which is $65535 + 1$ but returns $0$ rather than $65536$
- (2) Ten plus second largest number: `0000 0000 0000 1010 + 1111 1111 1111 1110 = 0000 0000 0000 0001` (+carry past 16th digit) which is $65534 + 10$ but returns $8$ rather than $65544$
---

- 2.25 Why does the sum of a negative 2’s complement number and a positive 2’s complement number never generate an overflow?

*Ans.-* Because addition of two operands with opposing signs will always move the result towards zero from either end thus, it will always fall within the range of numbers that can be represented in 2's complement.

---

- 2.26 You wish to express $-64$ as a 2’s complement number. 
    - a. How many bits do you need (the minimum number)?
    - b. With this number of bits, what is the largest positive number you can represent? (Please give answer in both decimal and binary.)
    - c. With this number of bits, what is the largest unsigned number you can represent? (Please give answer in both decimal and binary.)

*Ans.-*

- a. 7 bits with $[-64,63]$ 2's complemenent range .
- b. `63 = 0111111`
- c. `127 = 1111111`

---

2.27 The LC-3, a 16-bit machine, adds the two 2’s complement numbers `0101010101010101` and `0011100111001111`, producing `1000111100100100`. Is there a problem here? If yes, what is the problem? If no, why not?

*Ans.-* Yes, there is an overflow problem because we are adding two positive operands and the result is negative.

---

- 2.28 When is the output of an AND operation equal to 1?

*Ans.-* Only when both operands are ones.

---

- 2.29 Fill in the following truth table for a one-bit AND operation.

*Ans.-*

$$
\begin{array}{cc|c}
\text{X} & \text{Y} & \text{X AND Y} \\
\hline
0 & 0 & 0 \\
0 & 1 & 0 \\
1 & 0 & 0 \\
1 & 1 & 1 \\
\end{array}
$$

---

- 2.30 Compute the following. Write your results in binary.
    - a. `0101 0111 AND 1101 0111`
    - b. `101 AND 110`
    - c. `1110 0000 AND 1011 0100`
    - d. `0001 1111 AND 1011 0100`
    - e. `(0011 AND 0110) AND 1101`
    - f. `0011 AND (0110 AND 1101)`

*Ans.-*

- a. `0101 0111`
- b. `100`
- c. `1010 0000`
- d. `0001 0100`
- e. `0000`
- f. `0000`

---

- 2.31 When is the output of an OR operation equal to 1?

*Ans.-* When at least one input is 1.

---

- 2.32 Fill in the following truth table for a one-bit OR operation.

*Ans.-*

$$
\begin{array}{cc|c}
\text{X} & \text{Y} & \text{X OR Y} \\
\hline
0 & 0 & 0 \\
0 & 1 & 1 \\
1 & 0 & 1 \\
1 & 1 & 1 \\
\end{array}
$$

---

- 2.33 Compute the following:
    - a. `0101 0111 OR 1101 0111`
    - b. `101 OR 110`
    - c. `1110 0000 OR 1011 0100`
    - d. `0001 1111 OR 1011 0100`
    - e. `(0101 OR 1100) OR 1101`
    - f. `0101 OR (1100 OR 1101)`

*Ans.-*

- a. `1101 0111`
- b. `111` 
- c. `1111 0100`
- d. `1011 1111`
- e. `1101`
- f. `1101`

---

- 2.34 Compute the following:
    - a. `NOT(1011) OR NOT(1100)`
    - b. `NOT(1000 AND (1100 OR 0101))`
    - c. `NOT(NOT(1101))`
    - d. `(0110 OR 0000) AND 1111`

*Ans.-*

- a. `0111`
- b. `0111`
- c. `1101`
- d. `0110`

---

- 2.35 In Example 2.11, what are the masks used for?

*Ans.-* In example 2.11 aka the BUSYNESS example masks are used to change the state of units where ones in an AND mask will change state to *busy* and conversely ones in an OR mask will turn the state to *available*.

---

- 2.36 Refer to Example 2.11 for the following questions.
    - a. What mask value and what operation would one use to indicate that machine 2 is busy?
    - b. What mask value and what operation would one use to indicate that machines 2 and 6 are no longer busy? (Note: This can be done with only one operation.)
    - c. What mask value and what operation would one use to indicate that all machines are busy?
    - d. What mask value and what operation would one use to indicate that all machines are idle?
    - e. Using the operations discussed in this chapter, develop a procedure to isolate the status bit of machine 2 as the sign bit. For example, if the BUSYNESS pattern is `01011100`, then the output of this procedure is `10000000`. If the BUSYNESS pattern is `01110011`, then the output is `00000000`. In general, if the BUSYNESS pattern is:

$$
\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
b7 & b6 & b5 & b4 & b3 & b2 & b1 & b0 \\
\hline
\end{array}
$$

the output is:

$$
\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
b2 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
\hline
\end{array}
$$

*Hint:* What happens when you ADD a bit pattern to itself?

*Ans.-*

- a. The AND mask `00000010` indicates that machine 2 is busy.
- b. The OR mask `00100010` indicates that machines 2, 6 are available.
- c. The AND mask `11111111` turns all machines busy.
- d. The OR mask `11111111` turns all machines idle.
- e. We'll have to shift the 2nd bit $b2$ position 5 spots to the left and then apply the AND mask ie. apply: 

$$(\texttt{BUSYNESS AND }00000010)\times 2^5$$

---

- 2.37 If $n$ and $m$ are both four-bit 2’s complement numbers, and $s$ is the four-bit result of adding them together, how can we determine, using only the logical operations described in Section 2.6, if an overflow occurred during the addition? Develop a “procedure” for doing so. The inputs to the procedure are $n, m$, and $s$, and the output will be a bit pattern of all $0$s (`0000`) if no overflow occurred and `1000` if an overflow did occur.

*Ans.-* A procedure could be `P = ((n XOR s) AND (m XOR s)) AND 1000` where we only care about the bit signs. Each XOR compares the sign of one input to the sign of the output $s$ and returns `0` if both signs are the same (returns `1` otherwise). When no overflow occurs the signs of $n,m,s$ are all the same (wheather its all `0`s or all `1`s) thus ANDing both XORs returns `1` if there is overflow and `0` when there is not as shown in the table below. The final AND mask is just to isolate the sign bit.

$$
\begin{array}{lll|c}
n & m & s & P \\
\hline
0\texttt{\dots} & 0\texttt{\dots} & 0\texttt{\dots} & 0000 \\
0\texttt{\dots} & 0\texttt{\dots} & 1\texttt{\dots} & 1000 \\
0\texttt{\dots} & 1\texttt{\dots} & 0\texttt{\dots} & 0000 \\
0\texttt{\dots} & 1\texttt{\dots} & 1\texttt{\dots} & 0000 \\
0\texttt{\dots} & 0\texttt{\dots} & 0\texttt{\dots} & 0000 \\
1\texttt{\dots} & 0\texttt{\dots} & 1\texttt{\dots} & 0000 \\
1\texttt{\dots} & 1\texttt{\dots} & 0\texttt{\dots} & 1000 \\
1\texttt{\dots} & 1\texttt{\dots} & 1\texttt{\dots} & 0000 \\
\end{array}
$$

---

2.38 If $n$ and $m$ are both four-bit unsigned numbers, and $s$ is the four-bit result of adding them together, how can we determine, using only the logical operations described in Section 2.6, if an overflow occurred during the addition? Develop a “procedure” for doing so. The inputs to the procedure are $n, m,$ and $s$, and the output will be a bit pattern of all $0$s (`0000`) if no overflow occurred and `1000` if an overflow did occur.

*Ans.-*

---

- 2.39 Write IEEE floating point representation of the following decimal numbers.
    - a. $3.75$
    - b. $-55\frac{23}{64}$
    - c. $3.1415927$
    - d. $64,000$

*Ans.-*

> [!important] IEEE 754 - 32-bit floating point representation
> We can represent a floating number with less precision digits but greater range if we normalize it as
> 
> $N = (-1)^S \times 1.\texttt{fraction}\times 2^{\texttt{exponent}-127}, \quad\quad 1\leq\texttt{exponent}\leq 254$
> 
> where
> - $S$ needs one bit for the sign 
> - $\texttt{fraction}\text{ or }\texttt{mantissa}$ takes 23 unisgned bits for precision
> - $\texttt{exponent}$ takes 8 unsigned bits for the range (excluding `0 = 0000 0000` and `255 = 1111 1111` which are reserved for *subnormal numbers* and $\pm$infinity $(-1)^S \infty$, respectively)
> 
> The largest and smallest number that can be represented in normalized form are:
> 
> $$
> \begin{align*}
> N_{\text{largest}} &= 1.11111111111111111111111_2\times 2^{127}\sim 2 \times 2^{127} \sim 2^{128} \quad\text{(good approx. bad precision)} \\
> &= (1\cdot 2^0 + 1\cdot 2^{-1} + 1\cdot 2^{-2} + \ldots + 1\cdot 2^{-23}) \times 2^{127} \\
> &= (2-2^{-23}) \times 2^{127} = 2^{128}-2^{104} \quad(\sim 3.4028_{10} \times 10^{38} \texttt{ decimal})
> \end{align*}
> $$
> 
> $N_{\text{smallest}} = 1.00000000000000000000000_2\times 2^{-126} = 2^{-126} \quad (\sim 1.1755_{10} \times 10^{-38}\texttt{ decimal})$
> 
> If we divert out of normalization we can squeeze in more representations ie. **subnormal numbers**
> 
> $N^{\text{subnorm}} = (0.\texttt{fraction}\times 2^{0000\,0000_2 - 126_{10}})$ 
>
> gives us the ability to represent numbers with magnitudes smaller than $2^{-126}$ but larger than 0. Note that the deduction for the exponent is forced to be $-126$ rather than $-127$ for consistency. $\texttt{exponent}=0000\,0000$ is more like a cue that let us know that the number is subnormal. The range is:
> 
> $$
> \begin{align*}
> N^{\text{subnorm}}_{\text{largest}} &= 0.11111111111111111111111_2 \times 2^{-126} \\
> &= (1\cdot 2^{-1} + 1\cdot 2^{-2} + \ldots + 1\cdot 2^{-23}) \times 2^{-126} \\
> &= (1-2^{-23}) \times 2^{-126} = 2^{-126}-2^{-149} \quad (\sim 1.1755_{10} \times 10^{-38}\texttt{ decimal}) \\
> N^{\text{subnorm}}_{\text{smallest}} &= 0.00000000000000000000001_2 \times 2^{-126} \\
> &= 2^{-149} \quad (\sim 1.4013_{10} \times 10^{-45}\texttt{ decimal})
> \end{align*}
> $$
> 

- a. $11.11 = 1\cdot 2^1 + 1\cdot 2^0 + 1\cdot 2^{-1} + 1\cdot 2^{-2} = 1.111 \times 2^1 \rightarrow$ `0 10000000 11100000000000000000000`
- b. $-55.359375 = -110111.010111 = 1.10111010111 \times 2^{5} \rightarrow$ `1 10000100 10111010111000000000000`
- c. $3.1415927 = 11.0010010000111111011011 \rightarrow$ `0 10000000 10010010000111111011011`
- d. $64000 = 1111101000000000.0 = 1.111101 \times 2^{15} \rightarrow$ `0 10001110 11110100000000000000000`

---

- 2.41 
    - a. What is the largest exponent the IEEE standard allows for a 32-bit floating point number?
    - b. What is the smallest exponent the IEEE standard allows for a 32-bit floating point number?

*Ans.-* a,b. In IEEE $(\texttt{exponent}-127)\in[-126, 127]$ 

---

- 2.43 Translate the following ASCII codes into strings of characters by interpreting each group of eight bits as an ASCII character.
    - a. `x48656c6c6f21`
    - b. `x68454c4c4f21`
    - c. `x436f6d70757465727321`
    - d. `x4c432d32`

*Ans.-* 

- a. `Hello!`
- b. `hELLO!`
- c. `Computers!`
- d. `LC-2`

---

- 2.45 Convert the following unsigned binary numbers to hexadecimal.
    - a. `1101 0001 1010 1111`
    - b. `001 1111`
    - c. `1`
    - d. `1110 1101 1011 0010`

*Ans.-*

- a. `xD1AF`
- b. `x1F`
- c. `x1`
- d. `xEDB2`

---

- 2.47 Convert the following hexadecimal representations of 2’s complement binary numbers to decimal numbers.
    - a. `xF0`
    - b. `x7FF`
    - c. `x16`
    - d. `x8000`

*Ans.-*

- a. `1111 0000` in 2's complement (number is negative), now lets find the magnitude (-(flip + 1)) `-(0001 0000) = -16`
- b. `0111 1111 1111` its the upper bound of a 12-bit 2's complement whose range is $[-2048,2047]$, the number is `2047`
- c. `0001 0110` in 2's complement, its magnitude (flip + 1) is `1110 1010 = 234`
- d. `1000 0000 0000 0000` in 2's complement, its the lower bound for a 16-bit number $[-32768, 32767]$ so our number is `-32768`

---

- 2.49 Perform the following additions. The corresponding 16-bit binary numbers are in 2’s complement notation. Provide your answers in hexadecimal.
    - a. `x025B + x26DE`
    - b. `x7D96 + xF0A0`
    - c. `xA397 + xA35D`
    - d. `x7D96 + x7412`
    - e. What else can you say about the answers to parts c and d?

*Ans.-*

- a. `x02939`
- b. `x6E36`
- c. `x46F4`
- d. `xF1A8`
- We observe that problem c adds two negatives `xA = 1010` (encodes a negative sign bit `1`) and yields a positive sign bit `x4 = 0100`. In the same vein part d adds two positives `x7 = 0111` and returns a negative `xF = 1111`. We have overflow in both cases!

---

- 2.51 What is the hexadecimal representation of the following numbers?
    - a. $25,675$
    - b. $675.625$ (i.e., $675\frac{5}{8}$), in the IEEE 754 floating point standard
    - c. The ASCII string: Hello

*Ans.-* 

- a. `110 0100 0100 1011 = x644B` 
- b. $1010100011.101 = 1.010100011101 \times 2^9 \rightarrow$  `0 10001000 01010001110100000000000 = x4428E800`
- c. `Hello = x48656c6c6f`

---

- 2.53 Fill in the truth table for the equations given. The first line is done as an example.
$$
\begin{align*}
&Q_1 = \text{NOT (A AND B)} \\
&Q_2 = \text{NOT(NOT(A) AND NOT(B))} 
\end{align*}
$$

Express $Q_2$ in another way.

*Ans.-* $Q_2$ is exactly DeMorgan's law so we can express it as $Q_2 = \text{A OR B}$

$$
\begin{array}{cc|cc}
A & B & Q_1 & Q_2 \\
\hline
0 & 0 & 1 & 0 \\
0 & 1 & 1 & 1 \\
1 & 0 & 1 & 1 \\
1 & 1 & 0 & 1 
\end{array}
$$

---

- 2.55 We have represented numbers in base-2 (binary) and in base-16 (hex). We are now ready for unsigned base-4, which we will call quad numbers. A quad digit can be 0, 1, 2, or 3.
    - a. What is the maximum unsigned decimal value that one can represent with 3 quad digits?
    - b. What is the maximum unsigned decimal value that one can represent with $n$ quad digits? (Hint: Your answer should be a function of $n$.)
    - c. Add the two unsigned quad numbers: `023` and `221`.
    - d. What is the quad representation of the decimal number `42`?
    - e. What is the binary representation of the unsigned quad number `123.3`?
    - f. Express the unsigned quad number `123.3` in IEEE ﬂoating point format.
    - g. Given a black box that takes $m$ quad digits as input and produces one quad digit for output, what is the maximum number of unique functions this black box can implement?

*Ans.-* 

- a. $4^3-1=63$
- b. $4^n -1$
- c. The operation is shown below, where the carrys are noted as `+`s on top of the operand digits. A carry out of the Most Significant Bit (MSB) is noted as `(+)` if present and `( )` if not.
```
( )++
   023
+  221
------
   310
```
- d. We can build our quad construction basing on the 8-bit binary construction
$$
\begin{align*}
42 &= b_7\cdot 2^7 +b_6\cdot 2^6 + b_5\cdot 2^5 + b_4\cdot 2^4 + b_3\cdot 2^3 + b_2\cdot 2^2 + b_1\cdot 2^1  + b_0\cdot 2^0 \\
&= 2^6(b_7\cdot 2^1 + b_6\cdot 2^0) + 2^4(b_5\cdot 2^1  + b_4\cdot 2^0) + 2^2(b_3\cdot 2^1 + b_2\cdot 2^0) + 2^0(b_1\cdot 2^1  + b_0\cdot 2^0) \\
&= 4^3\cdot q_3 + 4^2\cdot q_2 + 4^1\cdot q_1 + 4^0\cdot q_0  && \texttt{42\%4=2}, q_0=2 //-2\&(4^{-1}) \\
10 &= 4^2\cdot q_3 + 4^1\cdot q_2 + 4^0\cdot q_1 && \texttt{10\%4=2},q_1=2 // -2\&(4^{-1}) \\
2 &= 4^1\cdot q_3 + 4^0\cdot q_2 && q_3\text{ not needed for representing 42 so }q_3=0 \\ 
\ldots \\
\rightarrow 42 &= 222
\end{align*}
$$

- e. Lets express $123.3 = q_2\cdot 4^2 + q_1\cdot 4^1 + q_0\cdot 4^0 + q_{-1}\cdot 4^{-1}$ where we know that $q_2=1,q_1=2,q_0=3,q_{-1}=3$
$$
\begin{align*}
q_2 &= b_5\cdot 2^1 + b_4\cdot 2^0 && b_5=0,b_4=1 \\
q_1 &= b_3\cdot 2^1 + b_2\cdot 2^0 && b_3=1,b_2=0 \\
q_0 &= b_1\cdot 2^1 + b_0\cdot 2^0 && b_1=1,b_0=1 \\
q_{-1} &= b_{-1}\cdot 2^1 + b_{-2}\cdot 2^0 && b_{-1}=1,b_{-2}=1
\end{align*}
$$
the number in binary is `011011.11` and in normalized form $1.101111\times 2^4$ which in IEEE is `0 10000011 10111100000000000000000`

- f. Lets use combinatorics reasoning here. We need to find the number of unique functions this black box can implement, since the output can only have 4 digits then the number of possibilities is $4^{f}$. Now, there is $4^m$ possible combinations of unique inputs and for each of these unique inputs we can have $4$ unique outputs or equivalently $4$ unique functions that produce each possible output. So the number of unique functions is $4^f=4^{4^m}$


---
