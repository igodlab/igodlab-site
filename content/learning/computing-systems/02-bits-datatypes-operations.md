---
title: Chapter 2 solutions - Bits, datatypes and operations
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

- 2.5 Using ﬁve bits to represent each number, write the representations of 7 and -7 in 1’s complement, signed magnitude, and 2’s complement integers.

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

| 4-bit  | unsigned | 2's comp. | 
|---|---|---|
| `0000` | `0` | `0` |
| `0001` | `1` | `1` |
| `0010` | `2` | `2` |
| `0011` | `3` | `3` |
| `0100` | `4` | `4` |
| `0101` | `5` | `5` | 
| `0110` | `6` | `6` |
| `0111` | `7` | `7` |
| `1000` | `8` | `-8` |
| `1001` | `9` | `-7` |
| `1010` | `10` | `-6` |
| `1011` | `11` | `-5` |
| `1100` | `12` | `-4` |
| `1101` | `13` | `-3` |
| `1110` | `14` | `-2` |
| `1111` | `15` | `-1` |

---

- 2.8
    - a. What is the largest positive number one can represent in an eight-bit 2’s complement code? Write your result in binary and decimal.
    - b. What is the greatest magnitude negative number one can represent in an eight-bit 2’s complement code? Write your result in binary and decimal.
    - c. What is the largest positive number one can represent in n-bit 2’s complement code?
    - d. What is the greatest magnitude negative number one can represent in n-bit 2’s complement code?

*Ans.-*

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

*Ans.-*

---

- 2.13 Without changing their values, convert the following 2’s complement binary numbers into eight-bit 2’s complement numbers.
    - a. `1010`
    - b. `011001`
    - c. `1111111000`
    - d. `01`

*Ans.-*

---
- 2.14 Add the following bit patterns. Leave your results in binary form.
    - a. `1011 + 0001`
    - b. `0000 + 1010`
    - c. `1100 + 0011`
    - d. `0101 + 0110`
    - e. `1111 + 0001`

*Ans.-*

---

- 2.15 It was demonstrated in Example 2.5 that shifting a binary number one bit to the left is equivalent to multiplying the number by 2. What operation is performed when a binary number is shifted one bit to the right?

*Ans.-*

---

- 2.16 Write the results of the following additions as both eight-bit binary and decimal numbers. For each part, use standard binary addition as described in Section 2.5.1.
    - a. Add the 1’s complement representation of $7$ to the 1’s complement representation of $-7$.
    - b. Add the signed magnitude representation of $7$ to the signed magnitude representation of $-7$.
    - c. Add the 2’s complement representation of $7$ to the 2’s complement representation of $-7$.

*Ans.-*

---

- 2.17 Add the following 2’s complement binary numbers. Also express the answer in decimal.
    - a. `01 + 1011`
    - b. `11 + 01010101`
    - c. `0101 + 110`
    - d. `01 + 10`

*Ans.-*

---

- 2.18 Add the following unsigned binary numbers. Also, express the answer in decimal.
    - a. `01 + 1011`
    - b. `11 + 01010101`
    - c. `0101 + 110`
    - d. `01 + 10`

*Ans.-*

---

2.19 Express the negative value $-27$ as a 2’s complement integer, using eight bits. Repeat, using 16 bits. Repeat, using 32 bits. What does this illustrate with respect to the properties of sign-extension as they pertain to 2’s complement representation?

*Ans.-*

---

- 2.20 The following binary numbers are four-bit 2’s complement binary numbers. Which of the following operations generate overflow? Justify your answer by translating the operands and results into decimal.
    - a. `1100 + 0011`
    - b. `1100 + 0100`
    - c. `0111 + 0001`
    - d. `1000 - 0001`
    - e. `0111 + 1001`

*Ans.-*

---

2.21 Describe what conditions indicate overflow has occurred when two 2’s complement numbers are added.

*Ans.-*

---

- 2.22 Create two 16-bit 2’s complement integers such that their sum causes an overflow.

*Ans.-*

---

- 2.23 Describe what conditions indicate overflow has occurred when two unsigned numbers are added.

*Ans.-*

---

- 2.24 Create two 16-bit unsigned integers such that their sum causes an overflow.

*Ans.-*

---

- 2.25 Why does the sum of a negative 2’s complement number and a positive 2’s complement number never generate an overflow?

*Ans.-*

---

- 2.26 You wish to express $-64$ as a 2’s complement number. 
    - a. How many bits do you need (the minimum number)?
    - b. With this number of bits, what is the largest positive number you can represent? (Please give answer in both decimal and binary.)
    - c. With this number of bits, what is the largest unsigned number you can represent? (Please give answer in both decimal and binary.)

*Ans.-*

---

2.27 The LC-3, a 16-bit machine, adds the two 2’s complement numbers `0101010101010101` and `0011100111001111`, producing `1000111100100100`. Is there a problem here? If yes, what is the problem? If no, why not?

*Ans.-*

---

- 2.28 When is the output of an AND operation equal to 1?

*Ans.-*

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
    - a. `01010111 AND 11010111`
    - b. `101 AND 110`
    - c. `11100000 AND 10110100`
    - d. `00011111 AND 10110100`
    - e. `(0011 AND 0110) AND 1101`
    - f. `0011 AND (0110 AND 1101)`

*Ans.-*

---

- 2.31 When is the output of an OR operation equal to 1?

*Ans.-*

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
1 & 1 & 0 \\
\end{array}
$$

---

- 2.33 Compute the following:
    - a. `01010111 OR 11010111`
    - b. `101 OR 110`
    - c. `11100000 OR 10110100`
    - d. `00011111 OR 10110100`
    - e. `(0101 OR 1100) OR 1101`
    - f. `0101 OR (1100 OR 1101)`

*Ans.-*

---

- 2.34 Compute the following:
    - a. `NOT(1011) OR NOT(1100)`
    - b. `NOT(1000 AND (1100 OR 0101))`
    - c. `NOT(NOT(1101))`
    - d. `(0110 OR 0000) AND 1111`

*Ans.-*

---

- 2.35 In Example 2.11, what are the masks used for?

*Ans.-*

---

- 2.36 Refer to Example 2.11 for the following questions.
    - a. What mask value and what operation would one use to indicate that machine 2 is busy?
    - b. What mask value and what operation would one use to indicate that machines 2 and 6 are no longer busy? (Note: This can be done with only one operation.)
    - c. What mask value and what operation would one use to indicate that all machines are busy?
    - d. What mask value and what operation would one use to indicate that all machines are idle?
    - e. Using the operations discussed in this chapter, develop a procedure to isolate the status bit of machine 2 as the sign bit. For example, if the BUSYNESS pattern is `01011100`, then the output of this procedure is `10000000`. If the BUSYNESS pattern is `01110011`, then the output is `00000000`. In general, if the BUSYNESS pattern is:

$$
\begin{array}{|c|c|c|c|c|c|c|}
\hline
b7 & b6 & b5 & b4 & b3 & b2 & b1  \\
\hline
\end{array}
$$

the output is:

$$
\begin{array}{|c|c|c|c|c|c|c|}
\hline
b2 & 0 & 0 & 0 & 0 & 0 & 0  \\
\hline
\end{array}
$$

*Hint:* What happens when you ADD a bit pattern to itself?

*Ans.-*

---

- 2.37 If $n$ and $m$ are both four-bit 2’s complement numbers, and $s$ is the four-bit result of adding them together, how can we determine, using only the logical operations described in Section 2.6, if an overflow occurred during the addition? Develop a “procedure” for doing so. The inputs to the procedure are $n, m$, and $s$, and the output will be a bit pattern of all $0$s (`0000`) if no overflow occurred and `1000` if an overflow did occur.

*Ans.-*

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

---

- 2.40 Write the decimal equivalents for these IEEE floating point numbers.
    - a. `0 10000000 00000000000000000000000`
    - b. `1 10000011 00010000000000000000000`
    - c. `0 11111111 00000000000000000000000`
    - d. `1 10000000 10010000000000000000000`

*Ans.-*

---

- 2.41 
    - a. What is the largest exponent the IEEE standard allows for a 32-bit floating point number?
    - b. What is the smallest exponent the IEEE standard allows for a 32-bit floating point number?

*Ans.-*

---

- 2.42 A computer programmer wrote a program that adds two numbers. The programmer ran the program and observed that when 5 is added to 8, the result is the character $m$. Explain why this program is behaving erroneously.

*Ans.-*

---

- 2.43 Translate the following ASCII codes into strings of characters by interpreting each group of eight bits as an ASCII character.
    - a. `x48656c6c6f21`
    - b. `x68454c4c4f21`
    - c. `x436f6d70757465727321`
    - d. `x4c432d32`

*Ans.-*

---

- 2.44 What operation(s) can be used to convert the binary representation for 3 (i.e., `0000 0011`) into the ASCII representation for 3 (i.e., `0011 0011`)? What about the binary 4 into the ASCII 4? What about any digit?

*Ans.-*

---

- 2.45 Convert the following unsigned binary numbers to hexadecimal.
    - a. `1101 0001 1010 1111`
    - b. `001 1111`
    - c. `1`
    - d. `1110 1101 1011 0010`

*Ans.-*

---

- 2.46 Convert the following hexadecimal numbers to binary.
    - a. `x10`
    - b. `x801`
    - c. `xF731`
    - d. `x0F1E2D`
    - e. `xBCAD`

*Ans.-*

---

- 2.47 Convert the following hexadecimal representations of 2’s complement binary numbers to decimal numbers.
    - a. `xF0`
    - b. `x7FF`
    - c. `x16`
    - d. `x8000`

*Ans.-*

---

- 2.48 Convert the following decimal numbers to hexadecimal representations of 2’s complement numbers.
    - a. $256$
    - b. $111$
    - c. $123,456,789$
    - d. $−44$

*Ans.-*

---

- 2.49 Perform the following additions. The corresponding 16-bit binary numbers are in 2’s complement notation. Provide your answers in hexadecimal.
    - a. `x025B + x26DE`
    - b. `x7D96 + xF0A0`
    - c. `xA397 + xA35D`
    - d. `x7D96 + x7412`
    - e. What else can you say about the answers to parts c and d?

*Ans.-*

---

- 2.50 Perform the following logical operations. Express your answers in hexadecimal notation.
    - a. `x5478 AND xFDEA`
    - b. `xABCD OR x1234`
    - c. `NOT((NOT(xDEFA)) AND (NOT(xFFFF)))`
    - d. `x00FF XOR x325C`

*Ans.-*

---

- 2.51 What is the hexadecimal representation of the following numbers?
    - a. $25,675$
    - b. $675.625$ (i.e., $675\frac{5}{8}$), in the IEEE 754 floating point standard
    - c. The ASCII string: Hello

*Ans.-*

---

- 2.52 Consider two hexadecimal numbers: `x434F4D50` and `x55544552`. What values do they represent for each of the ﬁve data types shown?

*Ans.-*

| | `x434F4D50` | `x55544552` |
|---|---|---|  
| Unsigned binary | & | & |
| 1's complement | & | & |
| 2's complement | & | & |
| IEEE 754 floating point | & | & |
| ASCII string | & | & |

---

- 2.53 Fill in the truth table for the equations given. The ﬁrst line is done as an example.
$$
\begin{align*}
&Q_1 = \text{NOT (A AND B)} \\
&Q_2 = \text{NOT(NOT(A) AND NOT(B))} 
\end{align*}
$$

Express $Q_2$ in another way.

*Ans.-*

$$
\begin{array}{cc|cc}
A & B & Q_1 & Q_2 \\
\hline
0 & 0 & 1 & 0 \\
0 & 1 &   &   \\
1 & 0 &   &   \\
1 & 1 &   &   
\end{array}
$$

---

- 2.54 Fill in the truth table for the equations given. The ﬁrst line is done as an example.
$$
\begin{align*}
&Q_1 = \text{NOT(NOT(X) OR (A AND Y AND Z))} \\
&Q_2 = \text{NOT((Y OR Z) AND (X AND Y AND Z))} 
\end{align*}
$$

*Ans.-*

$$
\begin{array}{ccc|cc}
X & Y & Z & Q_1 & Q_2 \\
\hline
0 & 0 & 0 & 1 & 0 \\
0 & 0 & 1 &   &   \\
0 & 1 & 0 &   &   \\
0 & 1 & 1 &   &   \\
1 & 0 & 0 &   &   \\
1 & 0 & 1 &   &   \\
1 & 1 & 0 &   &   \\
1 & 1 & 1 &   &   \\
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
    - g. Given a black box that takes m quad digits as input and produces one quad digit for output, what is the maximum number of unique functions this black box can implement?

*Ans.-*

---

- 2.56 Deﬁne a new eight-bit ﬂoating point format with one sign bit, four bits of exponent, using an excess-7 code (i.e., the bias is 7), and three bits of fraction. If `xE5` is the bit pattern for a number in this eight-bit ﬂoating point format, what value does it have? (Express as a decimal number.)

*Ans.-*

---

