---
title: 1. Fundamental concepts
date: 2025-10-26

---

# 1. Introduction

- One of the main ageless goals in Computer Science is to accelerate computing power ie. make processors go brrr
- The history of this battle goes back to the XX century where the first processor designs relied on a *Central Processing Unit (CPU)* hardware component that is capable of executing programs step by step (the [von Newmann et. al 1972](https://ieeexplore.ieee.org/abstract/document/238389) design based on a program counter for sequential program execution aka. *thread*). The story highlights go as follows:
    - **Single Microprocessor age** - progressively increased clock speeds of a single CPU (1980s-1990s). Brought GFLOPS (TFLOPS) to desktops (data centers)
    - **Megahertz wars** - reached a barrier trying to increase clock freq (<2003) due to heat dissipation and energy supply limits
    - **Concurrency revolution** - overcame the limit ([Sutter and Larus, >2005](https://dl.acm.org/doi/10.1145/1095408.1095421)) with *multi processor cores* where *parallel* programs execute multiple threads cooperatively to get the work done faster
    - **Inception of GPUs** - invention of a different architecture that is throughput-oriented (2006) to be combined with CPUs. Very impractical to use because the way of giving it instructions was through API-like General Purpose programming of GPU (GPGPU)
    - **[NVIDIA, 2007](https://dl.acm.org/doi/10.1145/1095408.1095421) gives birth to CUDA** - Market demand in gaming justified the commercial developement of GPUs (2007). NVIDIA's innovation was to build a silicon interface which serves the requests of *Compute Unified Architecture (CUDA)* programs, so GPGPUs wouldn't talk to the graphic interface at all

### 1.1 Heterogeneous parallel computing

- The industry settled on two non mutually-exclusive trajectories for designing microprocessors ([Hwu et al., 2008](https://www.scopus.com/pages/publications/49549087268)):
    - *Multicore trajectory* - seeks to maintain the execution speed of sequential programs while moving to multiple cores (eg. Intel's 24 *out-of-order* multicore supporting the full $\times 86$ instruction set. Or the ARM Ampere w/ 128 multicore)
    - *Many-thread trajectory* - focuses on execution throughput of parallel applications (eg. NVIDIA's Hopper H100 GPU w/ many 100k threads executing *in-order* pipelines)
- GPUs excel at floating-point operations, being capable of $\sim 30$ ($\sim 230$) times more throughput than CPUs at double-precision (single-precision)
    - eg. peak throughput of the H100 is 34.7 TFLOPS (64-bit double-precision), 67 TFLOPS (32-bit single-precision), 1979 TFLOPS (16-bit half-precision) whereas a server grade CPU of the same generation is onlt a few TFLOPS
- More and more applications developers have moved parts of their applications to run on GPUs due to the advantageous throughput gap. The philosophy that holds is "when there is more work to do, there is more opportunity to divide the work among cooperating parallel workers ie. *threads*"
    - The peak performance gap exists due to the differences in design where CPUs are optimized for latency. Whereas GPUs are optimized for throughput
    - It is more expensive to reduce latency than increase throughput.
- *Heterogeneus parallel computing* refers to non-homogeneus computing components ie. CPU-GPU (also field-programmable arrays for networking applications as well) and parallel refers to multicore parallel programs

### 1.2 Why more speed or parallelism

- Although, many applications run satisfactorily fast today the goal of the processor industry is to keep improving hardware for applications of the future eg. in fields like: Molecular Biology, TV/gaming/entertainment & Aritificial Intelligence (the most evident one)
- The goal of this book summary is to teach programming models that facilitate parallel implementations of data management and delivery (through CUDA)

### 1.3 Speeding up real applications

- Fortunately most parts of modern applications are candidates for *parallelization optimization* (basically everything excluding the sequential parts of an application where CPUs are the undisputed in-charge parts). The peach analogy is good for exemplifying this

<img src="/static/assets/learning/pmpp/ch013-peach.png" width="50%">
  
- The definition of *speedup* for an application by computing system A over computing system B is the ratio of execution times: $t^B_{\text{exec}}/t^A_{\text{exec}}$
    - The speedup that is achievable by a parallel computing system over a serial computing system depends on the portion of the application that can be parallelized. Given by [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl's_law): $\text{Speedup}_\text{overall}=\frac{1}{(1 - t_{\text{optimized}}) + \frac{t_{\text{optimized}}}{\text{Speedup}_{\text{optimized}}}}$
        -  eg. if a program's parallelizable part is $30\%$ a $100\times$ speedup of it would result is no more than $\frac{1}{(1 - 0.3) + \frac{0.3}{100}}=1.42\times$
        - see plotly Figure for a bigger picture of Amdahl law
    - Speedup doesn't depend only on *parallelizable optimization* but aslo on how fast we data can be accessed and written to the memory *bandwidth limitations*
        - the trick is to bypass memory limitations by applying transformations to utilize GPU memories to reduce number of accesses to the DRAM

<img src="/static/assets/learning/pmpp/ch013-amdahl-law.png" width="50%">

### 1.4 Challenges in parallel programming

- We wouldn't care about parallel programs if we didn't care about performance! But we do!
- Future Chapters deal with introducing nonintuitive ways of writing parallel programs, because many solutions are described in terms of *mathematical recurrences*. Some algo primitives are
        - *Prefix sum* - facilitates the conversion of sequential, recursive formulations into a more parallel one (Chapter 11)
    - *Work efficiency* - gives a metric that informs about the tradeoffs or parallelizing programs
    - *Memory-bound (& compute-bound) applications* - which speed is limited by memory access latency and/or throughput (number of instructions performed per byte of data) (Chapters 5, 6)
    - *Input data drawbacks* - irregularities in input data such as variable data sizes and uneven data distributions decrease effectiveness of parallel programs due to uneven amounts of work assigned to threads
    - *Embarassingly parallel* applications can be parallelized with little collaboration between threads. Their opposite are applications that need a lot of collaboration between threads require *synchronization techniques* eg. barriers & atomic operations
- Fortunately most of these challenges have been addressed by researchers

### 1.5 Related parallel programming interfaces

- Most significant parallel programming languages and interfaces:
    - **OpenMP ([Open, 2005](https://dl.acm.org/doi/10.1145/1095408.1095421))** - consists of a compiler and a runtime
        - Its compiler generates parallel code produced by the programmer who specifies directives (commands) and pragmas (hints)
        - The runtime system supports execution of such parallel code orchestrating threads an resources
        - Designed for CPU execution (latter added support for GPU) and offers compiler optimizations and & runtime support that abstracts away parallel programming details
        - Offers **Performance portability** ie. capability of preserving convenience and performance accross different hardware vendors
        - The drawback is that abstraction limits fine-grained control over the processing units
    - **Message Passing Interface ([MPI, 2009](https://www.mpi-forum.org/docs/mpi-2.2/mpi22-report.pdf))** is a programming interface where computing nodes don't share data and any data-sharing activity is done through explicit message passing
        - Became the de-facto standard in High Performance Computing (HPC). Had lots of success eg. modern HPC cluster systems run 100k+ heterogeneous CPU/GPU nodes
        - Porting an application to MPI is very challenging due to the lack of shared memory access accross nodes
        - Programmers have to carry the burden of performing domain decomposition to parition I/O of data accross nodes which implies calling message sending & receiving functions
        - CUDA entered the cluster market w/ multi-GPU support via APIs eg. the NVIDIA Collective Communications Library (NCCL). This extends the benefits of CUDA being an effective interface to a single-GPU node to multi-GPU nodes
        - Modern HPC experts do joint MPI/CUDA programming (Chapter 20)
    - A honorable mention is 2009's joint effort - *Open Compute Language ([OpenCL](https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html))* developed by Nvidia, AMD/ATI, Apple and Intel. OpenCL tried to be an open source alternative to parallelize GPU work on single node systems. However, it fell short and CUDA crushed it mainly because it cannot compete with all the CUDA ecosystem without any insights into its closed source competitor

### 1.6 Overarching goals
- To teach how to *program massively parallel processors* w/o extreme depth of hardware knowledge and rather build just basic intuitive understanding
- Wince the core focus is to develop high-performant code we need to remap our thinking for programming with parallelization patterns in mind

# 2. Hetereogeneous data parallel computing

### 2.1 Data parallelism

- *Data parallelism* - refers to the phenomenon in which different parts of the dataset can be computed independently
- We'll work alongside an example to elaborate on this topic. Lets consider image manipulation, where we handle millions to trillions of pixels
    - eg. to convert a colored image to grayscale we need to compute the luminosity to the three channel matrices: $L=0.21r+0.72g+0.07b$, for all $N-1$ pixels: $O[0]=L(I[0](r,g,b)),\ldots, O[N-1]=L(I[N-1](r,g,b))$
- > **Task Parallelism vs Data Parallelism** - in general, the former is the main source of scalability but not the only type of paralellism. The latter also gives room for sqeezing parallelizable performance and a nice detail is the larger the application, the larger the independent tasks present

###  2.2 CUDA C++ program structure

- CUDA C is NVIDIA's programming language that unlocks access to heterogeneous computing systems composed by CPU cores and massively parallel GPUs
    - CUDA C extends ANSI C with minimal new syntax and libraries (plus some C++ features) to target heterogenous computing
    - CUDA C's code structure reflects the structure of a *host* (CPU) and *devices* (GPUs) in a computer.
- Fig.2.3 shows the simplified (CPU threads don't overlap w/ GPU threads) scheme of the execution of *grids* 
    - In the color-to-grayscale example each thread will be used to compute one output pixel, so we can expect $N-1$ threads to be generated and scheduled. These take very few clock cycles in contrast to CPU threads which take thousands of clock cycles to generate and schedule
      
<img src="/static/assets/learning/pmpp/ch022-cuda-program.png" width="60%">
      
- > **Threads** - are a simplified view of how a processor executes a sequential program in a computer. Contains the code of the program, the point in the code that is being executed and the values of its variables and data structures. Threads are sequential, even in CUDA programs, where a program initiates parallel execution by calling kernel functions which launches grids of execution (through its underlying runtime mechanisms)

### 2.3 A vector addition kernel

- Lets walk through the "Hello World" equivalent example for sequential programming ie. vector addition. *Notation.-* host variables will always have `_h` whereas variables used by the device will have `_d`
    - Traditional vector addition (Fig.2.4) we initialize & allocate memory in `main` (skipped) and then compute everything on host; in parallelized vector addition (Fig.2.5) - in Part 1 we allocate memory and copy vectors to device, in Part 2 we launch the grid of threads to compute element-wise addition and in Part 3 we copy C back to host and remove all vectors in device
- > **Pointers in C lang** - regular (pointer) variables are declared as `float V` (`float *P`). We can make `P` access the value of `V` w/ `P=&V`. So the args for `vecAdd` are pointers that access the i-th element of `A_h, B_h, C_h`

### 2.4 Device global memory and data transfer

- CUDA hardware devices come with its own random-access memory called **device global memory** aka. *global memory* which is different than other memory components of a computer
- We've seen that computing the parallelized version of vector addition kernel (Fig.2.5) requires to perform **data transfers** from the host's memory to global memory and back (and free up memory after computations)
    - This is can be done thanks to **CUDA C runtime system** which offers APIs for the programmer to perform these activities eg. we'll use the ones below for vector addition implementation:

    - > CUDA C uses the standard C runtime library `malloc` function to manage the host memory (thus the similarity between `cudaMalloc` and C's `malloc`). Moreover, the fst arg for `cudaMalloc(void **  devPtr, ...)` has a double `**` ie. **address** to a pointer variable which allows to cast **any type** of object to global memory allocation

<img src="/static/assets/learning/pmpp/ch024-cuda-functions-vector-sum.png" width="100%">

- Applying these funcions to our vector addition, we now have Parts 1 & 3 of the program completed as seen in Fig.2.8

```cpp
__global__
void vecAddKernel(float* A, float* B, float* C, int n){
  int i = blockIdx * blockDim.x + threadIdx;
  if (i < n) {
    C[i] = A[i] + B[i];
  }
}

void vecAdd(float* A_h, float* B_h, float* C_h, int n) {
  int size = n * sizeof(float);

  // Initialize variables to be copied to GPU device
  float *A_d, *B_d, *C_d;

  cudaMalloc((void **) &A_d, (size_t) size);
  cudaMalloc((void **) &B_d, (size_t) size);
  cudaMalloc((void **) &C_d, (size_t) size);

  cudaMemcpy(A_d, A_h, size, cudaMemcpyHostToDevice);
  cudaMemcpy(B_d, B_h, size, cudaMemcpyHostToDevice);

  // Kernel invocation
  vecAddKernel<<<ceil(n/256.0), 256>>>(A_d, B_d, C_d, n);

  // Copy result from device to host
  cudaMemcpy(C_h, C_d, size, cudaMemcpyDeviceToHost);

  // Free variables from device
  cudaFree(A_d);
  cudaFree(B_d);
  cudaFree(C_d);
}
```

- In summary we must initialize memory allocation in device global memory w/ `cudaMalloc`, then transfer our vectors from host to device using `cudaMemcpy` (note the builtin constants `cudaMemcpyHostToDevice, cudaMemcpyDeviceToHost`) once everything computes we transfer the result back to the host and clear memory in global memory. What's left is to code grids and threads which we'll do in the next Section 2.5
    - > Note that we're omitting error handling in our code blocks

### 2.5 Kernel functions and threading

- A CUDA C kernel function specifies all the code that will be executed by all threads during a parallel phase.
    - CUDA C programming is an instance of the programming style standard **single-program multiple-data (SPMD)** ([Atallah, 1998](https://en.wikipedia.org/wiki/Single_program,_multiple_data))
- The workflows goes as follows: i) a host code executes a kernel instruction which ii) launches
