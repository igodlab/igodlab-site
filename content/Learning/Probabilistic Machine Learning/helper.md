## 2.3 A vector addition kernel

CUDA C functions for building the paralleized vector addition version

```c
cudaError_t cudaMalloc(void **  devPtr, size_t size)			
/* Allocates size bytes of linear memory on the devicle and returns in *devPtr a pointer to the
allocated memory. The allocated memory is suitably aligned for any kind of variable. The memory is not 
cleared. cudaMalloc() returns cudaErrorMemoryAllocation in case of failure.

Parameters:
devPtr 	- Pointer to allocated device memory
size 	- Requested allocation size in bytes
Returns:
cudaSuccess, cudaErrorMemoryAllocation */
```


```c
cudaError_t cudaFree(void * devPtr) 	
/* Frees the memory space pointed to by devPtr, which must have been 
returned by a previous call to cudaMalloc() or cudaMallocPitch(). 
Otherwise, or if cudaFree(devPtr) has already been called before, an
error is returned. If devPtr is 0, no operation is performed. 
cudaFree() returns cudaErrorInvalidDevicePointer in case of failure.

Parameters:
devPtr 	- Device pointer to memory to free
Returns: cudaSuccess, cudaErrorInvalidDevicePointer, cudaErrorInitializationError */
```

```c
cudaError_t cudaMemcpy (void * dst, const void * src, size_t count, enum cudaMemcpyKind kind)
/*Copies count bytes from the memory area pointed to by src to the memory area pointed to 
by dst, where kind is one of cudaMemcpyHostToHost, cudaMemcpyHostToDevice, cudaMemcpyDeviceToHost,
or cudaMemcpyDeviceToDevice, and specifies the direction of the copy. The memory areas may 
not overlap. Calling cudaMemcpy() with dst and src pointers that do not match the direction of 
the copy results in an undefined behavior.

Parameters:
dst 	- Destination memory address
src 	- Source memory address
count 	- Size in bytes to copy
kind 	- Type of transfer
Returns:
cudaSuccess, cudaErrorInvalidValue, cudaErrorInvalidDevicePointer, cudaErrorInvalidMemcpyDirection */
```
