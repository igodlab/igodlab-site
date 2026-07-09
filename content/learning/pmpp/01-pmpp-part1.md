---
title: 1. Fundamental concepts
date: 2026-01-26

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

# 3. Multidimensional grids and data

> [!IMPORTANT] Notation for R-rank tensors
> 
> We will follow the subscript notation for a R-rank covariant tensor that expresses indexes from <mark>*right-to-left* (from *fast-to-slow varying index*)</mark>. Moreover, we'll be consistent in **both** CUDA code notation and mathematical expressions!
> 
> The generalized notation for addressing a R-rank tensor element with dimensions $T\in\mathbb{R}^{d_{R-1} \times \cdots \times d_1 \times d_0}$ (*slow←fast*) is via its indexes $T_{i_{R-1},\ldots,i_1,i_0}$ (*slow←fast*), respectively.
> 
> The generalized stride $s_0=1,\; s_{r>0}=\prod_{k=0}^{r-1}d_k$ is needed to compute the index in a row-major flattened tensor: $\text{flat(index)}=\sum_{r=0}^{R-1}i_rs_r$. For example:
> - 3D tensor $T\in\mathbb{R}^{d_2\times d_1\times d_0}$ element $T_{i_2,i_1,i_0}$ as row-major $T_{i_0 + i_1\times d_0 + i_2\times(d_0\times d_1)}$
> - 4D tensor $T\in\mathbb{R}^{d_3\times d_2\times d_1\times d_0}$ element $T_{i_3,i_2,i_1,i_0}$ as row-major $T_{i_0 + i_1\times d_0 + i_2\times(d_0\times d_1) + i_3\times(d_0\times d_1\times d_2)}$
> 
> Throughout the book we'll use variations of symbols depending on what kind of variables we're dealing with so here is a useful table (up to 4-rank tensors):
>
> | Mathematical<br>genearlized | Unspecific | Deep Learning | CUDA `threads` | 
> | :--- | :--- | :--- | :--- |
> | $i_0\in[0, d_0-1]$ (dim-0) | $i\in[0,m-1]$ (cols)   | $c\in[0,C-1]$ (channels) | `threadIdx.x` (block-width)  |
> | $i_1\in[0, d_1-1]$ (dim-1) | $j\in[0,n-1]$ (rows)   | $w\in[0,W-1]$ (width)    | `threadIdx.y` (block-height) |
> | $i_2\in[0, d_2-1]$ (dim-2) | $k\in[0,p-1]$ (depth)  | $h\in[0,H-1]$ (height)   | `threadIdx.z` (block-depth)  |
> | $i_3\in[0, d_3-1]$ (dim-3) | $l\in[0,q-1]$ (sample) | $n\in[0,N-1]$ (batch)    | NA | 


# 4. Compute architecture and scheduling

### 4.4 Warps and SIMD hardware

- *Warp* - group of 32 threads (with continuous `threadIdx`s from 0 to 31)
    - The 32 thread indexes of warp $n$ are within the range $[32n, 32(n+1)-1]$
- *Single Instruction Multiple Data (SIMD)* capable hardware allow to process parallel data ie. GPU 

### 4.5 Control divergence
- *Control flow* - refers to the flow of threads along a path traced by control instructions. When threads in a warp take different control paths (eg. conditionals for boundary conditions) are said to exhibit *control divergence*
    - Performance impact of control divergence can be measured in percentage terms as $\text{divergent-warps}/\text{total-warps-in-grid}$
    - Different phases of thread execution do not necessarily have to be processed sequentially, this is known as *independent thread scheduling* (introduced in Volta's V100 architecture)
    - Warp-level barrier sync API `__syncwarp()`

### 4.6 Warp scheduling and latency tolerance
- An SM can execute a limited number of 128 threads (4 warps) at a given clock cycle. However, a single SM can be issued up to 2048 threads simultaneously (16x more than it can handle per clock-cycle). We'll break this down:
    - One thread per streaming processor per clock cycle (128 streaming processors in an SM can issue 128 concurrent instructions/clock-cycle).

### 4.7 Resource partitioning and occupancy
- *Occupancy* is the $\frac{\text{number-of-threads}/\text{SM}}{\text{max-number-of-threads}/\text{SM}}$ ratio

# 5. Memory architecture and data locality

### 5.1 Memory bandwidth as a performance limiter

- Define main metrics (both are hardware limits, not guarantees): 
    - *Peak computational throughput* - specifies the limit on how many arithmetic operations the hardware can perform per unit of time ie. FLOPS (different limits for different datatypes)
    - *Peak memory bandwidth* - specifies the limit on how many bytes of data the hardware can access from a particular memory structure per unit of time ie B/s (hardware has different limits for different memory structures)
- A kernel is said to be *compute-bound* (*memory-bound*) if its performance is limited by the computational throughput (limited by memory bandwidth) of the hardware.
    - *Compute-to-global-memory-access ratio* (also called arithmetic intensity or **computational intensity**) - $\frac{\text{FLOP}{\bcancel S}}{\text{B}/{\bcancel s}}=\frac{\text{FLOP}}{\text{B}}$ when its a big (small) value means compute-bound (memory-bound).
        - eg. H100 GPU has a threshold of $\frac{66.9 \text{ TFLOPS}}{3.35\text{ TB}/s} = 20\frac{\text{FLOP}}{\text{B}}$ 

<img src="static/assets/learning/pmpp/roofline-model.png" width="50%">

### 5.2 CUDA memory types

- *Distributed shared memory* - threads in the same thread block cluster can access the shared memory of any block in the cluster. 

| Variable declaration | Memory | Scope | Lifetime |
| :--- | :--- | :--- | :--- | 
| Automatic **scalar** variables | register | thread | grid | 
| Automatic **array** variables | local | thread | grid | 
| `__global__ __shared__ int SharedVar` | shared | block | grid | 
| `__device__ int GlobalVar;` | global | grid | application | 
| `__device__ __constant__ int ConstVar;` | constant | grid | application | 


<img src="static/assets/learning/pmpp/ch05-vonNeuman-CPU-GPU.png" width="100%">

### 5.3 Tiling for reduced memory traffic

> [!IMPORTANT] Notation for indexing threads.
> 
> $$
> \begin{array}{r|l}
> \textbf{Math} & \textbf{Code} \\
> \hline
> (z^\prime,y^\prime,x^\prime) & \texttt{threadIdx(.z, .y, .x)} \\
> (b_{z}, b_{y}, b_{x}) & \texttt{blockIdx(.z, .y, .x)} \\
> (d_{z}^b, d_{y}^b, d_{x}^b) & \texttt{blockDim(.z, .y, .x)} \\
> (d_{z}^g, d_{y}^g, d_{x}^g) & \texttt{gridDim(.z, .y, .x)} \\
> (d_{z}^\square, d_{y}^\square, d_{x}^\square) & \texttt{TILEz, TILEy, TILEx} \\
> \end{array}
> $$
> 
> Lets introduce absolute indexes and relative indexes, the latter are noted with a prime. Relative indexes reset for every block eg. warp 0 has threads 0-31 in block $(b_y,b_x)=(1,0)$ and warp 2 in the same block has the same indexes for its threads 0-31. However, the block index differs.
> 
> <img src="static/assets/learning/pmpp/ch05-absolute-relative-indexes.png" width="40%">
> 
> $$
> \begin{pmatrix}
> x \\
> y \\
> z
> \end{pmatrix} = 
> \begin{pmatrix}
> x^\prime + b_{x}d^b_{x} \\
> y^\prime + b_{y}d^b_{y} \\
> z^\prime + b_{z}d^b_{z}
> \end{pmatrix}
> $$


- **Tiling** is a cooperative loading technique that helps reducing memory-bandwidth by a significant factor (equal to the tile dimension). Basically by loading values that will be reused by many threads from global memory to `__shared__` memory so that all such threads have them within scope.
- Lets showcase memory-bandwidth reduction in the canonical matmul example $\mathbf{P}=\mathbf{M}\mathbf{N}$ where $\mathbf{M}\in\mathbb{R}^{d_1\times \tilde{d}},\, \mathbf{N}\in\mathbb{N}^{\tilde{d}\times d_0}$ thus $\mathbf{P}\in\mathbb{R}^{d_1\times d_0}$. The way we can use cooperative loading to shared memory is:
    - By defining two tiles: one for matrix $\mathbf{M}$ and another for matrix $\mathbf{N}$ which we'll call $\mathbf{M}^\square,\, \mathbf{N}^\square$ each of dimensions $d^\square \times d^\square$, respectively.

<img src="static/assets/learning/pmpp/ch05-tiling.png" width="50%">

- For the sake of simplicity we'll consider the case where the block dimension is the same as tile dimension ie. $(d^b_y, d^b_x)=(d^\square, d^\square)$. 
    - Cooperative loading is efficiently carried out in $h$ phases which range between $0\leq h < d^\square$ and loads each tile elements

    $$
    \begin{align*}
    M^\square_{y^\prime,x^\prime} = & M_{y,x^\prime +hd^\square} \\
    N^\square_{y^\prime,x^\prime}= & N_{y^\prime+hd^\square,x} 
    \end{align*}
    $$

which in written in row-major notation are

$$
\begin{align*}
M_{y,x^\prime +hd^\square} = & M_{y \tilde{d} + x^\prime +hd^\square} \\
N_{y^\prime+hd^\square,x} = & N_{(y^\prime+hd^\square)d_{0} + x} \\
=& N_{y^\prime d_{0} +hd^\square d_{0} + x}
\end{align*}
$$

<img src="static/assets/learning/pmpp/ch05-cooperative-loading.png" width="75%">

So in tiled matmul the output-matrix elements are computed with the generalized formula:

$$
P_{y,x}=\sum_{h=0}^{\left\lceil \tilde{d}/d^{\square}\right\rceil}\left(\sum_{k=0}^{d^{\square}-1}M^{\square}_{y^\prime,k}N^{\square}_{k,x^\prime}\right)
$$

# 6. Performance considerations

- CUDA devices employ a technique that allows programmers to achieve high global memory access efficiency by organizing memory accesses of threads into favorable patterns.

