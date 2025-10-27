---
title: 2. Heterogeneous data parallel computing
date: 2025-10-26

---

## 2.1 Data parallelism

- *Data parallelism* - refers to the phenomenon in which different parts of the dataset can be computed independently
- We'll work alongside an example to elaborate on this topic. Lets consider image manipulation, where we handle millions to trillions of pixels
    - eg. to convert a colored image to grayscale we need to compute the luminosity to the three channel matrices: $L=0.21r+0.72g+0.07b$, for all $N-1$ pixels: $O[0]=L(I[0](r,g,b)),\ldots, O[N-1]=L(I[N-1](r,g,b))$
- > **Task Parallelism vs Data Parallelism** - in general, the former is the main source of scalability but not the only type of paralellism. The latter also gives room for sqeezing parallelizable performance and a nice detail is the larger the application, the larger the independent tasks present

## 2.2 CUDA C program structure

- CUDA C is NVIDIA's programming language that unlocks access to heterogeneous computing systems composed by CPU cores and massively parallel GPUs
    - CUDA C extends ANSI C with minimal new syntax and libraries (plus some C++ features) to target heterogenous computing
    - CUDA C's code structure reflects the structure of a *host* (CPU) and *devices* (GPUs) in a computer.
- Fig.2.3 shows the simplified (CPU threads don't overlap w/ GPU threads) scheme of the execution of *grids* 
    - In the color-to-grayscale example each thread will be used to compute one output pixel, so we can expect $N-1$ threads to be generated and scheduled. These take very few clock cycles in contrast to CPU threads which take thousands of clock cycles to generate and schedule
      
<img src="../assets/learning/cuda/ch022-cuda-program.png" width="75%">
      
- > **Threads** - are a simplified view of how a processor executes a sequential program in a computer. Contains the code of the program, the point in the code that is being executed and the values of its variables and data structures. Threads are sequential, even in CUDA programs, where a program initiates parallel execution by calling kernel functions which launches grids of execution (through its underlying runtime mechanisms)

## 2.3 A vector addition kernel

- Lets walk through the "Hello World" equivalent example for sequential programming ie. vector addition. *Notation.-* host variables will always have `_h` whereas variables used by the device will have `_d`
    - Traditional vector addition (Fig.2.4) we initialize & allocate memory in `main` (skipped) and then compute everything on host; in parallelized vector addition (Fig.2.5) - in Part 1 we allocate memory and copy vectors to device, in Part 2 we launch the grid of threads to compute element-wise addition and in Part 3 we copy C back to host and remove all vectors in device
      
<img src="../assets/learning/cuda/ch023-vector-sum.png" width="100%">
      
- > **Pointers in C lang** - regular (pointer) variables are declared as `float V` (`float *P`). We can make `P` access the value of `V` w/ `P=&V`. So the args for `vecAdd` are pointers that access the i-th element of `A_h, B-h, C_h`

## 2.4 Device global memory and data transfer

- CUDA hardware devices come with its own random-access memory called **device global memory** aka. *global memory* which is different than other memory components of a computer
- We've seen that computing the parallelized version of vector addition kernel (Fig.2.5) requires to perform **data transfers** from the host's memory to global memory and back (and free up memory after computations)
    - This is can be done thanks to **CUDA C runtime system** which offers APIs for the programmer to perform these activities eg. we'll use the ones below for vector addition implementation:

    - > CUDA C uses the standard C runtime library `malloc` function to manage the host memory (thus the similarity between `cudaMalloc` and C's `malloc`). Moreover, the fst arg for `cudaMalloc(void **  devPtr, ...)` has a double `**` ie. **address** to a pointer variable which allows to cast **any type** of object to global memory allocation

<img src="../assets/learning/cuda/ch024-cuda-functions-vector-sum.png" width="100%">

- Applying these funcions to our vector addition, we now have Parts 1 & 3 of the program completed as seen in Fig.2.8

<img src="../assets/learning/cuda/ch024-vector-sum.png" width="60%">

- In summary we must initialize memory allocation in device global memory w/ `cudaMalloc`, then transfer our vectors from host to device using `cudaMemcpy` (note the builtin constants `cudaMemcpyHostToDevice, cudaMemcpyDeviceToHost`) once everything computes we transfer the result back to the host and clear memory in global memory. What's left is to code grids and threads which we'll do in the next Section 2.5
    - > Note that we're omitting error handling in our code blocks

## 2.5 Kernel functions and threading

- A CUDA C kernel function specifies all the code that will be executed by all threads during a parallel phase.
    - CUDA C programming is an instance of the programming style standard **single-program multiple-data (SPMD)** ([Atallah, 1998](https://en.wikipedia.org/wiki/Single_program,_multiple_data))
- The workflows goes as follows: i) a host code executes a kernel instruction which ii) launches
