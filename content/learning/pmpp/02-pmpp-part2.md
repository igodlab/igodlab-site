---
title: 2. Parallel Patterns
date: 2026-05-03

---

# 8. Stencil

- Stencil-based techniques are fundamental to solving differential equations. 
- Numerical approximations near the vicinity of the values of a function's co-domain given a range of domain values of our interest resemble similarities with convolution's sliding conv-kernel
    - Differential equations for instance require high precision thus we'll use big precision types in CUDA

- *Stencil sweep* - is the computation pattern where a stencil is applied to the all the relevant input grid points to generate the output values at all grid points.

- **Stencil through heat equation** - lets build a stencil algorithm that increasely optimizes from regular *parallel stencil* to *i)* square-tile, *ii)* thread coarsening and *iii)* register tiling. So the heat equation for $u(x,y,z,t)$ is

$$
\frac{\partial u}{\partial t} = \alpha\nabla^2 u
$$

- where $\nabla^2 = \frac{\partial^2}{\partial x^2} + \frac{\partial^2}{\partial y^2} + \frac{\partial^2}{\partial z^2}$ is the **Laplacian** and provides a notion of curvature. To solve it numerically we need to discretize each derivative:
    - time derivative: $$ \frac{\partial u}{\partial t}\approx \frac{U^{(t+1)}_{k,j,i}-U^{(t)}_{k,j,i}}{\Delta t} $$
    - Laplacian (showing only x): $$ \frac{\partial^2 u}{\partial x^2}\approx \frac{U^{(t)}_{k,j,i+1} - 2U^{(t)}_{k,j,i} + U^{(t)}_{k,j,i-1}}{2\Delta x^2} $$

- Knowing the *thermal diffusivity* $\alpha\equiv \frac{\kappa}{c_p \rho}$, where the constants are material-specific *thermal conductivity* $\kappa$, *heat capacity* $c_p$ and *mass density* $\rho$; we can define the following constants $C_x=\alpha\frac{\Delta t}{2\Delta x^2},\, C_y=\alpha\frac{\Delta t}{2\Delta y^2},\, C_z=\alpha\frac{\Delta t}{2\Delta z^2}$. So the final numerical equation looks like:

$$
\begin{align*}
U^{(t+1)}_{k,j,i} = U^{(t)}_{k,j,i} & + C_x \left( U^{(t)}_{k,j,i+1} - 2U^{(t)}_{k,j,i} + U^{(t)}_{k,j,i-1} \right ) \\
& + C_y \left( U^{(t)}_{k,j+1,i} - 2U^{(t)}_{k,j,i} + U^{(t)}_{k,j-1,i} \right ) \\
& + C_z \left( U^{(t)}_{k+1,j,i} - 2U^{(t)}_{k,j,i} + U^{(t)}_{k-1,j,i} \right ) 
\end{align*}
$$

