---
title: "Chapter 6 solutions - Programming"
date: "2999-11-24"
---

- 6.1 Can a procedure that is not an algorithm be constructed from the three basic constructs of structured programming? If so, demonstrate through an example.

*Ans.-*

---

- 6.3 Recall the machine busy example from previous chapters. Suppose memory location x4000 contains an integer between 0 and 15 identifying a particular machine that has just become busy. Suppose further that the value in memory location `x4001` tells which machines are busy and which machines are idle. Write an LC-3 machine language program that sets the appropriate bit in `x4001` indicating that the machine in `x4000` is busy. For example, if `x4000` contains `x0005` and `x4001` contains `x3101` at the start of execution, `x4001` should contain `x3121` after your program terminates.

*Ans.-*

---

- 6.5 Which of the two algorithms for multiplying two numbers is preferable and why? $88 \cdot 3 = 88 + 88 + 88 \texttt{ OR } 3 + 3 + 3 + 3 + \ldots + 3$?

*Ans.-*

---

- 6.7 What does the following LC-3 program do?

$$
\begin{array}{ccccc}
\texttt{x3001} & 1110 & 0000 & 0000 & 1100 \\
\texttt{x3002} & 1110 & 0010 & 0001 & 0000 \\
\texttt{x3003} & 0101 & 0100 & 1010 & 0000 \\
\texttt{x3004} & 0010 & 0100 & 0001 & 0011 \\
\texttt{x3005} & 0110 & 0110 & 0000 & 0000 \\
\texttt{x3006} & 0110 & 1000 & 0100 & 0000 \\
\texttt{x3007} & 0001 & 0110 & 1100 & 0100 \\
\texttt{x3008} & 0111 & 0110 & 0000 & 0000 \\
\texttt{x3009} & 0001 & 0000 & 0010 & 0001 \\
\texttt{x300A} & 0001 & 0010 & 0110 & 0001 \\
\texttt{x300B} & 0001 & 0100 & 1011 & 1111 \\
\texttt{x300C} & 0000 & 0011 & 1111 & 1000 \\
\texttt{x300D} & 1111 & 0000 & 0010 & 0101 \\
\texttt{x300E} & 0000 & 0000 & 0000 & 0101 \\
\texttt{x300F} & 0000 & 0000 & 0000 & 0100 \\
\texttt{x3010} & 0000 & 0000 & 0000 & 0011 \\
\texttt{x3011} & 0000 & 0000 & 0000 & 0110 \\
\texttt{x3012} & 0000 & 0000 & 0000 & 0010 \\
\texttt{x3013} & 0000 & 0000 & 0000 & 0100 \\
\texttt{x3014} & 0000 & 0000 & 0000 & 0111 \\
\texttt{x3015} & 0000 & 0000 & 0000 & 0110 \\
\texttt{x3016} & 0000 & 0000 & 0000 & 1000 \\
\texttt{x3017} & 0000 & 0000 & 0000 & 0111 \\
\texttt{x3018} & 0000 & 0000 & 0000 & 0101
\end{array}
$$

*Ans.-*

---

- 6.9 Using the iteration construct, write an LC-3 machine language routine that displays exactly 100 Zs on the screen.

*Ans.-* 

---

- 6.11 Write an LC-3 machine language routine to increment each of the numbers stored in memory location A through memory location B. Assume these locations have already been initialized with meaningful numbers. The addresses A and B can be found in memory locations x3100 and x3101.

*Ans.-*

---

- 6.13 Notice that we can shift a number to the left by one bit position by adding it to itself. For example, when the binary number 0011 is added to itself, the result is `0110`. Shifting a number one bit pattern to the right is not as easy. Devise a routine in LC-3 machine code to shift the contents of memory location `x3100` to the right by one bit.

*Ans.-*

---

6.15 Shown below are the contents of memory and registers before and after the LC-3 instruction at location `x3010` is executed. Your job: Identify the instruction stored in `x3010`. Note: There is enough information below to uniquely specify the instruction at `x3010`.
$$
\begin{array}{l|l|l}
  & \text{Before} & \text{After} \\
\hline
R0: & \texttt{x3208} & \texttt{x3208}  \\
R1: & \texttt{x2d7c} & \texttt{x2d7c}  \\
R2: & \texttt{xe373} & \texttt{xe373}  \\
R3: & \texttt{x2053} & \texttt{x2053}  \\
R4: & \texttt{x33ff} & \texttt{x33ff}  \\
R5: & \texttt{x3f1f} & \texttt{x3f1f}  \\
R6: & \texttt{xf4a2} & \texttt{xf4a2}  \\
R7: & \texttt{x5220} & \texttt{x5220}  \\
\hline
\ldots &  & \\
\texttt{x3400}:  & \texttt{x3001} & \texttt{x3001} \\
\texttt{x3401}:  & \texttt{x7a00} & \texttt{x7a00} \\
\texttt{x3402}:  & \texttt{x7a2b} & \texttt{x7a2b} \\
\texttt{x3403}:  & \texttt{xa700} & \texttt{xa700} \\
\texttt{x3404}:  & \texttt{xf011} & \texttt{xf011} \\
\texttt{x3405}:  & \texttt{x2003} & \texttt{x2003} \\
\texttt{x3406}:  & \texttt{x31ba} & \texttt{xe373} \\
\texttt{x3407}:  & \texttt{xc100} & \texttt{xc100} \\
\texttt{x3408}:  & \texttt{xefef} & \texttt{xefef} \\
\ldots &  & 
\end{array}
$$

*Ans.-*

---

- 6.17 Shown below are the contents of registers before and after the LC-3 instruction at location x3210 is executed. Your job: Identify the instruction stored in `x3210`. Note: There is enough information below to uniquely specify the instruction at `x3210`.
$$
\begin{array}{r|l|l}
& \text{Before} & \text{After} \\
\hline
R0: & \texttt{xFF1D} & \texttt{xFF1D} \\
R1: & \texttt{x301C} & \texttt{x301C} \\
R2: & \texttt{x2F11} & \texttt{x2F11} \\
R3: & \texttt{x5321} & \texttt{x5321} \\
R4: & \texttt{x331F} & \texttt{x331F} \\
R5: & \texttt{x1F22} & \texttt{x1F22} \\
R6: & \texttt{x01FF} & \texttt{x01FF} \\
R7: & \texttt{x341F} & \texttt{x3211} \\
PC: & \texttt{x3210} & \texttt{x3220} \\
N:  & 0     & 0     \\
Z:  & 1     & 1     \\
P:  & 0     & 0    
\end{array}
$$

*Ans.-* 

---

- 6.19 It is often necessary to encrypt messages to keep them away from prying eyes. A message can be represented as a string of ASCII characters, one per memory location, in consecutive memory locations. Bits $[15:8]$ of each location contain 0, and the location immediately following the string contains `x0000`. A student who has not taken this course has written the following LC-3 machine language program to encrypt the message starting at location `x4000` by adding 4 to each character and storing the resulting message at `x5000`. For example, if the message at `x4000` is *“Matt,”* then the encrypted message at `x5000` is *“Qeyy.”* However, there are four bugs in his code. Find and correct these errors so that the program works correctly.
$$
\begin{array}{ccccc}
\texttt{x3000} & 1110 & 0000 & 0000 & 1010 \\
\texttt{x3001} & 0010 & 0010 & 0000 & 1010 \\
\texttt{x3002} & 0110 & 0100 & 0000 & 0000 \\
\texttt{x3003} & 0000 & 0100 & 0000 & 0101 \\
\texttt{x3004} & 0001 & 0100 & 1010 & 0101 \\
\texttt{x3005} & 0111 & 0100 & 0100 & 0000 \\
\texttt{x3006} & 0001 & 0000 & 0010 & 0001 \\
\texttt{x3007} & 0001 & 0010 & 0110 & 0001 \\
\texttt{x3008} & 0000 & 1001 & 1111 & 1001 \\
\texttt{x3009} & 0110 & 0100 & 0100 & 0000 \\
\texttt{x300A} & 1111 & 0000 & 0010 & 0101 \\
\texttt{x300B} & 0100 & 0000 & 0000 & 0000 \\
\texttt{x300C} & 0101 & 0000 & 0000 & 0000
\end{array}
$$

*Ans.-*

---

- 6.21 You have been asked to design the volume control system in a stereo. The user controls the volume by using Volume Up and Volume Down buttons on the stereo. When the user presses the Volume Up button, the volume should increase by 1; when the user presses the Volume Down button, the volume should decrease by 1. The volume level is represented as a four-bit unsigned value, ranging from 0 to 15. If the user presses Volume Up when the volume is already at the maximum level of 15, the volume should remain at 15; similarly, if the user presses Volume Down when the volume is already at the minimum level of 0, the volume should remain at 0. The memory location `x3100` has been directly hooked up to the speakers so that reading bits 3 through 0 from that memory location will give the current speaker volume, while writing bits $[3:0]$ of that memory location will set the new speaker volume. When the user presses one of the volume buttons, the stereo hardware will reset the PC of the processor to `x3000` and begin execution. If the user presses Volume Up, then memory location `x3101` will be set to 1; otherwise, if the user presses Volume Down, then the memory location `x3101` will be set to 0. Below is the program that controls the volume on the stereo. Two of the instructions in the program have been left out. Your job: Fill in the missing instructions so that the program controls the volume correctly as speciﬁed.
$$
\begin{array}{c|c|l}
\text{Address} & \text{Contents} & \text{Description} \\
\hline
\texttt{x3000}   & 0010\;0000\;1111\;1111 & R0 \leftarrow M[\texttt{x3100}] \\
\texttt{x3001}   & 0010\;0010\;1111\;1111 & R1 \leftarrow M[\texttt{x3101}] \\
\texttt{x3002}   & 0000\;0100\;0000\;0100 & \text{Branch to }\texttt{x3007}\text{ if Z is set} \\
\texttt{x3003}   &   &   \\
\texttt{x3004}   & 0000\;0100\;0000\;0101 & \text{Branch to }\texttt{x300A}\text{ if Z is set} \\
\texttt{x3005}   & 0001\;0000\;0010\;0001 & R0 \leftarrow R0 + \texttt{x0001} \\
\texttt{x3006}   & 0000\;1110\;0000\;0011 & \text{Branch always to }\texttt{x300A}      \\
\texttt{x3007}   & 0001\;0010\;0010\;0000 & R1 \leftarrow R0 + \texttt{x0000}             \\
\texttt{x3008}   & 0000\;0100\;0000\;0001 & \text{Branch to }\texttt{x300A}\text{ if Z is set} \\
\texttt{x3009}   &   &   \\
\texttt{x300A}   & 0011\;0000\;1111\;0101 & M[\texttt{x3100}] \leftarrow R0 \\
\texttt{x300B}   & 1111\;0000\;0010\;0101 & \texttt{TRAP x25}
\end{array}
$$

*Ans.-* 

---

- 6.23 The PC is loaded with `x3000`, and the instruction at address `x3000` is executed. In fact, execution continues and four more instructions are executed. The table below contains the contents of various registers at the end of execution for each of the ﬁve (total) instructions. Your job: Complete the table. Let’s start execution again, starting with `PC = x3000`. First, we re-initialize R0 and R1 to 0, and set a breakpoint at `x3004`. We press RUN eleven times, and each time the program executes until the breakpoint. What are the ﬁnal values of R0 and R1?

*Ans.-*
$$
\begin{array}{l|c|c|c|c|c|c}
  & \textbf{PC} & \textbf{MAR} & \textbf{MDR} & \textbf{IR} & \textbf{R0} & \textbf{R1} \\
\hline
\text{Before execution starts} & \texttt{x3000} & - & - & - & \texttt{x0000} & \texttt{x0000} \\
\text{After the 1st finishes}  & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{xB333}           & \texttt{x2005} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} \\
\text{After the 2nd finishes}  & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x0601} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} \\
\text{After the 3rd finishes}  & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x1}\color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x0001} &  \\
\text{After the 4th finishes}  & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x1}\color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x6666} & \color{Violet}\texttt{-} \\
\text{After the 5th finishes}  & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x0BFC} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} 
\end{array}
$$

---

6.25 A student is writing a program and needs to subtract the contents of R1 from the contents of R2 and put the result in R3. Instead of writing:
$$
\begin{array}{ll}
\texttt{NOT} & \texttt{R3,R1} \\
\texttt{ADD} & \texttt{R3,R3,\#1} \\
\texttt{ADD} & \texttt{R3,R3,R2}
\end{array}
$$
she writes:
$$
\begin{array}{ll}
\texttt{NOT} &   \texttt{R3,R1} \\
\texttt{.FILL} & \texttt{x16E1} \\
\texttt{ADD} &   \texttt{R3,R3,R2}
\end{array}
$$
She assembles the program and attempts to execute it. Does the subtract execute correctly? Why or why not?

*Ans.-*

---

- 6.27 An LC-3 program starts execution at `x3000`. During the execution of the program, a snapshot of all eight registers was taken at six diﬀerent times as shown below: before the program executes, after execution of
    - instruction 1, after execution of instruction 2, after execution of
    - instruction 3, after execution of instruction 4, after execution of
    - instruction 5, and after execution of instruction 6.
Also, during the execution of the program, the PC trace, the MAR trace, and the MDR trace were recorded as shown below. Note that a PC trace records the addresses of the instructions executed in sequence by the program.
Your job: Fill in the missing entries in the three tables above.

*Ans.-*

$$
\begin{array}{l|c|c|c|c|c|c|c}
\textbf{Registers} & \textbf{Initial} & \textbf{After 1st} &  \textbf{After 2nd} & \textbf{After 3rd} & \textbf{After 4th} & \textbf{After 5th} & \textbf{After 6th} \\
& \textbf{Value} & \textbf{Instruction} & \textbf{Instruction} & \textbf{Instruction} & \textbf{Instruction} & \textbf{Instruction} & \textbf{Instruction} \\
\hline
\textbf{R0} & \texttt{x4006} & \texttt{x4050} & \texttt{x4050} & \texttt{x4050} & \texttt{x4050} & \texttt{x4050} & \texttt{x4050} \\
\textbf{R1} & \texttt{x5009} & \texttt{x5009} & \texttt{x5009} & \texttt{x5009} & \texttt{x5009} & \texttt{x5009} & \texttt{x5009} \\
\textbf{R2} & \texttt{x4008} & \texttt{x4008} & \texttt{x4008} & \texttt{x4008} & \texttt{x4008} & \texttt{x4008} & \texttt{xC055} \\
\textbf{R3} & \texttt{x4002} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x8005} & \texttt{x8005} & \texttt{x8005} & \texttt{x8005} \\
\textbf{R4} & \texttt{x4003} & \texttt{x4003} & \texttt{x4003} & \texttt{x4003} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x4003} \\
\textbf{R5} & \texttt{x400D} & \texttt{x400D} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x400D} & \texttt{x400D} & \texttt{x400D} \\
\textbf{R6} & \texttt{x400C} & \texttt{x400C} & \texttt{x400C} & \texttt{x400C} & \texttt{x400C} & \texttt{x400C} & \texttt{x400C} \\
\textbf{R7} & \texttt{x6001} & \texttt{x6001} & \texttt{x6001} & \texttt{x6001} & \color{Violet}\texttt{-} & \color{Violet}\texttt{-} & \texttt{x400E} 
\end{array}
$$

---
