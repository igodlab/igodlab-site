---
title: Ch01 - Exercises Solutions
date: 2025-09-28
---

- **1.1** Explain the ﬁrst of the two important ideas stated in Section 1.5.

*Ans.-* So this is the answer...

---
- **1.2** Can a higher-level programming language instruct a computer to compute more than a lower-level programming language?

*Ans.-* No it cannot. Higher-level programming languages have a limitation regarding their capability of instructing computation to be made 

---
- **1.3** What diﬃculty with analog computers encourages computer designers to use digital designs?

*Ans.-*

---
- **1.4** Name one characteristic of natural languages that prevents them from being used as programming languages.

*Ans.-*

---
- **1.5** Say we had a “black box,” which takes two numbers as input and outputs their sum. See Figure 1.10a. Say we had another box capable of multiplying two numbers together. See Figure 1.10b. We can connect these boxes together to calculate $p × (m + n)$. See Figure 1.10c. Assume we have an unlimited number of these boxes. Show how to connect them together to calculate:
    - a. $ax + b$\/n
    - b. The average of the four input numbers $w, x, y,$ and $z$ \n
    - c. $a2 + 2ab + b2$ (Can you do it with one add box and one multiply box?) \n

*Ans.-* So this is an answer

---
- **1.6** Write a statement in a natural language, and oﬀer two diﬀerent interpretations of that statement.

*Ans.-* The statement: *"This sentence doesn't exist"* is a Godel-like incompleteness kind of statement which has at least two interpretations. First we can take the literal meaning that the sentence doesn't exist. However, that immediately lead us to a consequential interpretation that, since we are actually reading the statement, then of course it factually exists.

---
- **1.7** The discussion of abstraction in Section 1.3.1 noted that one does not need to understand the makeup of the components as long as “everything about the detail is just ﬁne.” The case was made that when everything is not ﬁne, one must be able to deconstruct the components, or be at the mercy of the abstractions. In the taxi example, suppose you did not understand the component, that is, you had no clue how to get to the airport. Using the notion of abstraction, you simply tell the driver, *“Take me to the airport.”* Explain when this is a productivity enhancer, and when it could result in very negative consequences.

*Ans.-*

---
-**1.8** John said, “I saw the man in the park with a telescope.” What did he mean? How many reasonable interpretations can you provide for this statement? List them. What property does this sentence demonstrate that makes it unacceptable as a statement in a program?

*Ans.-*

---
- **1.9** Are natural languages capable of expressing algorithms?

*Ans.-*

---
- **1.10** Name three characteristics of algorithms. Brieﬂy explain each of these three characteristics.

*Ans.-*

---
- **1.11** For each characteristic of an algorithm, give an example of a procedure that does not have the characteristic and is therefore not an algorithm.

*Ans.-*

---
- **1.12** Are items a through e in the following list algorithms? If not, what qualities required of algorithms do they lack?
    - a. Add the ﬁrst row of the following matrix to another row whose ﬁrst column contains a non-zero entry. (Reminder: Columns run vertically; rows run horizontally.)$$
\begin{bmatrix}
1 & 2 & 0 & 4 \\
0 & 3 & 2 & 4 \\
2 & 3 & 10 & 22 \\
12 & 4 & 3 & 4
\end{bmatrix}$$
    - b. In order to show that there are as many prime numbers as there are natural numbers, match each prime number with a natural number in the following manner. Create pairs of prime and natural numbers by matching the ﬁrst prime number with 1 (which is the ﬁrst natural number) and the second prime number with 2, the third with 3, and so forth. If, in the end, it turns out that each prime number can be paired with each natural number, then it is shown that there are as many prime numbers as natural numbers.
    - c. Suppose you’re given two vectors each with 20 elements and asked to perform the following operation: Take the ﬁrst element of the ﬁrst vector and multiply it by the ﬁrst element of the second vector. Do the same to the second elements, and so forth. Add all the individual products together to derive the dot product.
    - d. Lynne and Calvin are trying to decide who will take the dog for a walk. Lynne suggests that they ﬂip a coin and pulls a quarter out of her pocket. Calvin does not trust Lynne and suspects that the quarter may be weighted (meaning that it might favor a particular outcome when tossed) and suggests the following procedure to fairly determine who will walk the dog.
        - 1. Flip the quarter twice.
        - 2. If the outcome is heads on the ﬁrst ﬂip and tails on the second, then I will walk the dog.
        - 3. If the outcome is tails on the ﬁrst ﬂip and heads on the second, then you will walk the dog.
        - 4. If both outcomes are tails or both outcomes are heads, then we ﬂip twice again. Is Calvin’s technique an algorithm?
    - e. Given a number, perform the following steps in order:
        - 1. Multiply it by 4
        - 2. Add 4
        - 3. Divide by 2
        - 4. Subtract 2
        - 5. Divide by 2
        - 6. Subtract 1
        - 7. At this point, add 1 to a counter to keep track of the fact that you performed steps 1 through 6. Then test the result you got when you subtracted 1. If 0, write down the number of times you performed steps 1 through 6 and stop. If not 0, starting with the result of subtracting one, perform the seven steps again.

*Ans.-* 

---

- **1.13** Two computers, A and B, are identical except for the fact that A has a subtract instruction and B does not. Both have add instructions. Both have instructions that can take a value and produce the negative of that value. Which computer is able to solve more problems, A or B? Prove your result.

*Ans.-* 

---

- **1.14** Suppose we wish to put a set of names in alphabetical order. We call the act of doing so sorting. One algorithm that can accomplish that is called the bubble sort. We could then program our bubble sort algorithm in C and compile the C program to execute on an x86 ISA. The x86 ISA can be implemented with an Intel Pentium IV microarchitecture. Let us call the sequence “Bubble Sort, C program, x86 ISA, Pentium IV microarchitecture” one transformation process. Assume we have available four sorting algorithms and can program in C, C++, Pascal, Fortran, and COBOL. We have available compilers that can translate from each of these to either x86 or SPARC, and we have available three diﬀerent microarchitectures for x86 and three diﬀerent microarchitectures for SPARC.
    - a. How many transformation processes are possible?
    - b. Write three examples of transformation processes.
    - c. How many transformation processes are possible if instead of three diﬀerent microarchitectures for x86 and three diﬀerent microarchitectures for SPARC, there were two for x86 and four for SPARC?

*Ans.-* 

---

- **1.15** Identify one advantage of programming in a higher-level language compared to a lower-level language. Identify one disadvantage.

*Ans.-* 

---

- **1.16** Name at least three things speciﬁed by an ISA.

*Ans.-* 

---

- **1.17** Brieﬂy describe the diﬀerence between an ISA and a microarchitecture.

*Ans.-* 

---

- **1.18** How many ISAs are normally implemented by a single microarchitecture? Conversely, how many microarchitectures could exist for a single ISA?

*Ans.-* 

---

- **1.19** List the levels of transformation and name an example for each level.

*Ans.-* 

---

- **1.20** The levels of transformation in Figure 1.9 are often referred to as levels of abstraction. Is that a reasonable characterization? If yes, give an example. If no, why not?

*Ans.-* 

---

- **1.21** Say you go to the store and buy some word processing software. What form is the software actually in? Is it in a high-level programming language? Is it in assembly language? Is it in the ISA of the computer on which you’ll run it? Justify your answer.

*Ans.-* 

---

- **1.22** Suppose you were given a task at one of the transformation levels shown in Figure 1.9, and required to transform it to the level just below. At which level would it be most diﬃcult to perform the transformation to the next lower level? Why?

*Ans.-* 

---

- **1.23** Why is an ISA unlikely to change between successive generations of microarchitectures that implement it? For example, why would Intel want to make certain that the ISA implemented by the Pentium III is the same as the one implemented by the Pentium II? Hint: When you upgrade your computer (or buy one with a newer CPU), do you need to throw out all your old software?

*Ans.-* 

---

