# 4 Graphical Models

## 4.1 Introduction
- Two key principles for building learning models are: *modularity* & *abstraction*, and probability theory brings both under an aligned approach
- **Probabilistic Graphical Models (PGMs)** are a math formalism to reason about parameters that describe probabilistic behaviours
    - based on graphs where nodes are rvs and vertices (or lack of vertices) that represent **conditional independence (CI)** between rvs
    - useful to model complex systems and define CI to compute estimates or inference


### 4.2 Directed graphical models (Bayes nets)
- Based on *Directed Probabilistic Graphical Models (DPGMs)* which are *directed acyclic graphs (DAGs)* aka. **Bayes Nets/belief networks**
    - fun fact, they don't have anything to do w/ Bayes, its just a model for reasoning about prob dists


### 4.2.1 Representing the joint distribution
- A nice property of DAGs is that nodes are ordered such that childs $x_{i}$ always come after predecesor or parent nodes $\boldsymbol{x}_{\text{pred}(i)/\text{par}(i)}$ such that: $x_{i} \perp \boldsymbol{x}_{\text{pred}(i)/\text{par}(i)}\mid \boldsymbol{x}_{\text{par}(i)}$
- Thus, joint dists for any phenomena using prob chains of $N_G$ nodes: $p(\boldsymbol{x}_{1:N_G})=\prod_{i=1}^{N_G}p(x_i\mid\boldsymbol{x}_{\text{par}(i)})$
    - where $p(x_i\mid\boldsymbol{x}_{\text{par}(i)})$ is the *Conditional Prob Dist (CPD)* for node $i$ 
    - KEY ADVANTAGE for expressing dists in this way is that the number of parameters needed is significanlty less
        - eg. if $N_G$ is the number of nodes and rv have $K$ discrete states then in an *unstructured joint prob* we need $O(K^{N_G})$ params to specify the prob of every configuration
        - conversely, in a DAG we only need predecesors and parents (say we have at most $N_{P}$ parents) then we only need $O(N_{G}K^{N_{P}+1})$ params



### 4.2.2 Examples
- Examples of how DPGMs can be useful


#### 4.2.2.1 Markov chains
- If we are dealing w/ Markov chains then the joint dist is very similar to the joint dist above (Sec.4.2.1), but now time dictates sequence
    - for a one-dim Markov model (unigram): $p(\boldsymbol{x}_{1:T})=p(x_1)\prod_{t=2}^{T}p(x_t\mid \boldsymbol{x}_{1:t-1})$
    - for a two-dim Markov model (bigram): $p(\boldsymbol{x}_{1:T})=p(x_1, x_2)\prod_{t=3}^{T}p(x_t\mid \boldsymbol{x}_{t-2:t-1})$
    - where, in either case, the lookup table aka **Conditional Probability Table (CPT)** has its emlements $p(x_t=k\mid x_{t-1}=j)=\theta_{jk}$ bounded to $[0,1]$ & row-normalized
    
    
#### 4.2.2.2 The "student" network
- This is another exmple, where we want to know the prob of a student taking a class, and all this is depended on 5 params (D: difficulty, I:intelligence, G: grade, L: reccom letter, S: SAT score).
    - Joint prob is written respecting the topology of the graph (Fig.4.2) and then expanded using the chain rule of probs, lastly simplify whatever that can be simplified based on the context (eg. in this case L is cond independent to all other parents except for G): 
    - $p(D, I, G, L, S)=p(L\mid S,G,D,I)p(S\mid G,D,I)p(G\mid D,I)p(D\mid I)p(I)=p(L\mid G)p(S\mid I)p(G\mid D,I)p(D)p(I)$
- In DPGMs formulation we can write the CPT for the $i$-th node as: $\theta_{ijk}=p(x_i=k\mid\boldsymbol{x}_{\text{par}(i)}=j)$, where we satisfy 
    - boundedness: $0\leq\theta_{ijk}\leq 1$
    - normalization: $\sum_{k=1}^{K}\theta_{ijk}=1$ for all $\forall j$
    - $i\in[N_G]$ indexes nodes; $k\in[K_i]$ indexes node states ($K_i$ is num of states for $i$-th node); $j\in[J_i]$ indexes joint parent states ($J_i=\prod_{p\in\text{par}(i)}K_{p}$)
    - latter on we'll see better more parsimonius representations. So far we have the number of params in a CPT: $O(K^{p+1})$, where $K$ is the num of states per node and $p$ the num of parent nodes
    
#### 4.2.2.3 Sigmoid beliefs nets
- A **sigmoid belief net** is a special case of a **deep generative model** (we'll discuss hierarchical deep gen models in Chapter.21) 
- (eg. Fig.4.3a) if we want to model two hidden layers (not-autoregressive) with $\boldsymbol{x}$ as visible nodes (shaded), $\boldsymbol{z}$ as hidden internal nodes ($K_l$ hidden nodes at $l$-th level), the joint prob is: $p(\boldsymbol{x},\boldsymbol{z})=p(\boldsymbol{z}_2)p(\boldsymbol{z}_1\mid\boldsymbol{z}_2)p(\boldsymbol{x}\mid\boldsymbol{z}_1)=\prod_{k=1}^{K_2}p(z_{2,k})\prod_{k=1}^{K_1}p(z_{1,k}\mid\boldsymbol{z}_2)\prod_{d=1}^{D}p(x_d\mid\boldsymbol{z}_1)$
    - the *sigmoid belief net* is the special case where all latent vars are binary and all latent CPDs are log-regs: $p(\boldsymbol{z}_l\mid\boldsymbol{z}_{l+1},\boldsymbol{\theta})=\prod_{k=1}^{K_l}\operatorname{Ber}(z_{l,k}\mid\sigma(\boldsymbol{w}_{l,k}^{\top}\boldsymbol{z}_{l+1}))$
    - and at the bottom layer we use whatever appropriate model fits the case eg. normal: $p(\boldsymbol{x},\boldsymbol{z}_1,\boldsymbol{\theta})=\prod_{d=1}^{D}\mathcal{N}\left(x_d\mid\boldsymbol{w}_{1,d,\mu}^{\top}\boldsymbol{z}_1, \exp(\boldsymbol{w}_{1,d,\sigma}^{\top}\boldsymbol{z}_1)\right)$
- Fig.4.3b adds direct connections between hidden layers, called **Deep Autoregressive Network (DARN)** combining ideas from latent var modeling and autoregressive modeling

<img src="Learning/images/probml/ch04222-sigmoid-belief-nets.png" width="80%">

### 4.2.3 Gaussian Bayes nets
- When all layer transfers are linears, the joint dist for $i$-th node is: $p(x_i\mid\boldsymbol{x}_{\text{par}(i)})=\mathcal{N}(x_i\mid\mu_i+\boldsymbol{w}_i^{\top}\boldsymbol{x}_{\text{par}(i)},\sigma_i^2)$
- This is generalized by multiplying all nodes: $p(\boldsymbol{x})=\mathcal{N}(\boldsymbol{x}\mid\boldsymbol{\mu},\mathbf{\Sigma})$, where with some manipulations we can calculate:
    - vector of outcomes $\boldsymbol{x}$ (center-shifted for mathematical convenience): $\boldsymbol{x}-\boldsymbol{\mu}=(\mathbf{I}-\mathbf{W})^{-1}\boldsymbol{e}=\mathbf{U}\mathbf{S}\boldsymbol{z}$, with the var chg: $\mathbf{U}=(\mathbf{I}-\mathbf{W})^{-1}$ and noise $\boldsymbol{e}=\mathbf{S}\boldsymbol{z}$
    - covariance mat: $\operatorname{Cov}[\boldsymbol{x}-\boldsymbol{\mu}]=\operatorname{Cov}[\boldsymbol{x}]=\mathbf{U}\mathbf{S}^2\mathbf{U}^{\top}$'
    
    
### 4.2.4 Conditional independence properties
- We say that set $A$ is **Conditionally Independent** of set $B$ given set $C$ in the graph $G$: $\boldsymbol{x}_A \perp_{G}\boldsymbol{x}_B\mid \boldsymbol{x}_C$
    - $I(G)$: set of all CI statements encoded in the graph and $I(p)$: set of CI statements that hold true in some dist $p$
    - iif $I(G)\subseteq I(p)$ (=graph statements doesn't make CI assertions that don't hold in dist $p$) then we say $G$ is an (independence map) **I-map** OR $p$ is **Markov**
    - this enables to use the graph as a proxi for $p$'s CI properties regardless of the diversity of prob classes that may be involved
    - $G$ is a **minimal I-map** of $p$ when its an I-map and there is no additional $G^{\prime}\subseteq G$ 

- Subsections below explore how to derive $I(G)$, which properties are defined by DAG

#### 4.2.4.1 Global Markov properties (d-separation)
- **d-separation** is a CI criterion that says: the *undirected path* $P$ is d-separated by a set $C$ iif one of the three cases is true (with the nodes\rvs $x\in X\subset A$, $y\in Y\subset C$ and $z\in Z\subset B$):
    - 1) $P$ contains a *pipe*: $A\rightarrow y\in C \rightarrow B$
        - $p(x,z\mid y)=p(x\mid y)p(z\mid y) \Rightarrow X\perp Z\mid Y$
    - 2) $P$ contains a *fork*: $A\swarrow y\in C \searrow B$
        - $p(x,z\mid y)=p(x\mid y)p(z\mid y) \Rightarrow X\perp Z\mid Y$
    - 3) $P$ contains a *v-structure/collider*: $A\searrow y\not\in C \swarrow B$ nor further child nodes when it is the edge in v-structure (yields to **explaining away/Berkson's paradox** ie. $y$ conditions parent nodes/makes them dependent)
        - $p(x,z\mid y)=\frac{p(x)p(z)p(y\mid x,y)}{p(y)} \Rightarrow X\not\perp Z\mid Y$
- After at least one of these verify we can write the **global Markov property**: $X_A\perp X_B\mid X_C$ $\Leftrightarrow$ $A$ is d-separated from $B$ given observed $C$
- Rules are nicely portrayed in Fig.4.4 and Fig.4.5 below

<img src='Learning/images/probml/ch0424-bayes-ball-rules.png' width='85%'>


#### 4.2.4.2 Explaining away (Berkon's paradox)
- aka. **sampling bias** eg:
    - if we run 100 experiments of two coins tosses, but ONLY RECORD when we have at least one head, we'd register approx 70 datapoints
    - another example, three Normal uncorrelated dists $p(x,y\mid z)=\mathcal{N}_x\mathcal{N}_y\mathcal{N}_z$ can appear correlated if we truncate measurements (of conditional $z$) $p(x,x\mid z>2.5)$ (Fig.4.6 in book)


#### 4.2.4.3 Markov blankets
- Smallest set of nodes $\text{mb}(i)$ that ensure CI for $i$-th node with all other nodes $X_{-i}$ in the graph 
    - $\text{mb}(i)=\text{ch}(i) \cup \text{par}(i) \cup \text{copar}(i)$ : considering child $\text{ch}(i)$, parent $\text{par}(i)$ and co-parent $\text{copar}(i)$ nodes
    - key result is that we can define the Markov blanket based on nodes that are in "scope" of $X_i$, and claim CI for all the graph! (eq.4.27-31, terms that don't involve $X_i$ cancel out): $p(X_i\mid X_{-i})\propto p\left(X_i\mid\text{par}(X_i)\right) \prod_{Y_{j}\in\text{ch}(X_i)}p\left(Y_j\mid\text{par}(Y_j)\right)$
    - then the **full conditional** follows: $p(x_i\mid\boldsymbol{x}_{-i})=p\left(x_i\mid\boldsymbol{x}_{\text{mb}(i)}\right)\propto p\left(x_i\mid\boldsymbol{x}_{\text{par}(i)}\right)\prod_{k\in\text{ch}(i)}p\left(x_k\mid\boldsymbol{x}_{\text{par}(k)}\right)$
        - this is connected to Gibbs sampling (eq.12.19) and Mean Field Variational Inference (eq.10.87)


#### 4.2.4.4 Other Markov properties
- Basically these are the foundations to establish how to treat joint posteriors (as full joints or conditional)
- We have three key properties to reason about CI in DPGMs graphs when focusing on a specific node $i$. The notation $A\diagdown B$ means the set $A$ except $B$s, we've implied $B\subseteq A$
    - 1. (G) *Global Markov property* (Sec.4.2.4.1): $X_A\perp X_B\mid X_C$ $\Leftrightarrow$ $A$ is d-separated from $B$ given observed $C$
    - 2. (L) *Local Markov property*: $i\perp \text{nd}(i)\diagdown\text{par}(i)\mid\text{par}(i)$, where $\text{nd}$ are non-descendants
    - 3. (O) *Ordered Markov propery*: $i\perp \text{pred}(i)\diagdown \text{par}(i)\mid \text{par}(i)$  
- There is a hierarchy of how we apply these criteria: $G \Rightarrow L \Rightarrow O$ or $O\Rightarrow L \Rightarrow G$ as well


### 4.2.5 Generation (sampling)
- Easy to sample in DGPMs: **ancestral sampling** sample each node obeying *topological order* (parents first, childs given parents follow)
    - following this we are guaranteed to get independent samples from the joint $(x_1,\ldots,x_{N_G})\sim p(\boldsymbol{x}\mid\boldsymbol{\theta})$

### 4.2.6 Inference
- Note on notation for general unambiguity in this sub-section, $Q$ are query nodes, $V$ are visible nodes and nuisance nodes are $R=\{1,\ldots,N_G\}\diagdown \{Q,V\}$ (can represent hparams or noise). 
- The posterior marginal for node $Q$ is (summ for discrete &  int for continuous) is:
    - we want to infer $Q$ given $V$ (derived directly from the chain rule of cond probs) and marginalize out nuisance vars: $p_{\boldsymbol{\theta}}(Q\mid V)=\frac{p_{\boldsymbol{\theta}}(Q,V)}{p_{\boldsymbol{\theta}}(V)}=\frac{\sum_R p_{\boldsymbol{\theta}}(Q,V,R)}{p_{\boldsymbol{\theta}}(V)}$
    - if $R$ is noise or irrelevant factors and is intrinsic to $Q$ then, re-write the post dist in terms of full hidden vars $H=Q\cup R$: $p_{\boldsymbol{\theta}}(H\mid V)=\frac{p_{\boldsymbol{\theta}}(H,V)}{p_{\boldsymbol{\theta}}(V)}=\frac{p_{\boldsymbol{\theta}}(H,V)}{\sum_{H^\prime}p_{\boldsymbol{\theta}}(H^\prime,V)}$
- Unfortunately, this is **NP-hard** in general! 
    - we only have efficient solutions for some certain graph structures eg. chains, trees, sparse graphs

#### 4.2.6.1 Example: inference in the student network
- See book


### 4.2.7 Learning
- So far we've assumed that $G$ (nodes that satisfy the global Markov property G) and $\boldsymbol{\theta}$ are known. However, it is possible to learn both from data $\mathcal{D}$ (=$V$), assuming $G$ is fixed
    - so the posterior is (as usual) $p(\boldsymbol{\theta}\mid\mathcal{D})$, but in reality it is easier (or even only feasible) to compute a point estimate $\hat{\boldsymbol{\theta}}_{\text{MAP}/\text{MLE}}$
    - turns out that $\hat{\boldsymbol{\theta}}$ is not a bad approx since it depends on all the data (all other nodes) in the graph as opposed to hparams that depend on a smaller subset of $N_G$
    
#### 4.2.7.1 Learning from complete data
- Lets explore the example of a supervised generative classifier (Fig.4.9) 
    - where we have $N$ obervations (shaded nodes). We observe both: i) labels $\boldsymbol{y}$ that condition ii) $\boldsymbol{x}$'s classification and all data is complete! Additionally the global params G are: $\boldsymbol{\theta}_x$ and $\boldsymbol{\theta}_y$

<img src='Learning/images/probml/ch0427-dpgm-example.png' width='80%'>

- Following the CI properties from the graph we can write the joint dist (factorizing the corresponding CI nodes): $p(\boldsymbol{\theta},\mathcal{D})=p(\boldsymbol{\theta}_x)p(\boldsymbol{\theta}_y)\left[\prod_{n}^{N}p(y_n\mid\boldsymbol{\theta}_y)p(\boldsymbol{x}_{n}\mid\boldsymbol{\theta}_x, y_n) \right]=\ldots=\left[p(\boldsymbol{\theta}_y)p(\mathcal{D}_y\mid\boldsymbol{\theta}_y)\right]\left[p(\boldsymbol{\theta}_x)p(\mathcal{D}_x\mid\boldsymbol{\theta}_x)\right]$
    - where $D_y=\{y_n\}_{n=1}^{N}$ ($D_x=\{\boldsymbol{x}_{n},y_n\}_{n=1}^{N}$) are the observations for the $2N$ nodes $y$ ($\boldsymbol{x}$)
    - we see that things factorize nicely in a familiar format (prior $\times$ likelihood, for each)! 
    - so we can compute the post for each node independently: $p(\boldsymbol{\theta},\mathcal{D})=\prod_{i=1}^{N_G}\text{posterior}_{i}=\prod_{i=1}^{N_G}p(\boldsymbol{\theta}_i)p(\mathcal{D}_i\mid\boldsymbol{\theta}_i)$
    - and a point approx, eg. MLE: $\hat{\boldsymbol{\theta}}=\operatorname{argmax}_{\boldsymbol{\theta}}\prod_{i=1}^{N_G}p(\mathcal{D}_i\mid\boldsymbol{\theta}_i)$, can be computed for each node independently (see next Sec.4.6.7.2)
    
    
#### 4.2.7.2 Example: computing the MLE for CPTs
- We'll speedrun through this section. The most general expression of the likelihood (generalizes the previous example) is a prod of $N$ observations and prod of all nodes $N_G$ : $p(\mathcal{D}\mid\boldsymbol{\theta})=\prod_{n=1}^{N}\prod_{i=1}^{N_G}p(x_{n,i}\mid\boldsymbol{x}_{n,\text{par}(i),\boldsymbol{\theta}_i})$
    - which its params can be written with an indicator matrix notation: $\theta_{ijk}=p(x_i=k\mid \boldsymbol{x}_{n,\text{par}(i)}=\boldsymbol{j})$ ie. node $i$ is in state $k$ whileparent nodes are in the joint state $\boldsymbol{j}$
    - then the *sufficient stats* in the configuration are: $N_{ijk}=\sum^{N}\mathbb{I}(x_{n,i}=k\mid\boldsymbol{x}_{n,\text{par}(i)}=\boldsymbol{j})$
    - the MLE then is: $\hat{\theta}_{ijk}=\frac{N_{ijk}}{\sum_{k^\prime}N_{ijk^\prime}}$
- A huge problem is, again, sparsity. This causes estimates to be prone to biases (small sample size eg. *zero-count*), see next Sec.4.6.7.3 for Bayesian solutions to this


#### 4.2.7.3 Example: Computing posterior for CPTs
- In the last section we've seen how to obtain a CPT for a discrete Bayes net. The problem was *zero-count*. Here, we see a Bayesian workaround using *Dirichlet priors* on every row $\boldsymbol{\theta}_{ij}\sim\operatorname{Dir}(\boldsymbol{\alpha}_{ij}) \Rightarrow \boldsymbol{\theta}_{ijk}\mid\mathcal{D}\sim\operatorname{Dir}(\mathbf{N}_{ij}+\boldsymbol{\alpha}_{ij})$ 
    - where $N_{ijk}$ is num of times node $i$ is in state $k$ while its parents are in joint state $\boldsymbol{j}$
    - we copmute the posterior mean by basically adding pseudocounts to the empirical counts: $\bar{\theta}_{ijk}=\frac{N_{ijk}+\alpha_{ijk}}{\sum_{k^\prime}(N_{ijk^\prime}+\alpha_{ijk^\prime})}$
    - MAP uses $\alpha_{ijk}-1$ instead of just $\alpha_{ijk}$


#### 4.2.7.4 Learning from incomplete data
- If we have incomplete or missing data we can no longer decompose the CPD's likelihoods nor posteriors based on CI! As opposed to Sec.4.2.7.1
    - Fig.4.10 (in book) shows this, basically is the same graph as Fig.4.9 with renamed nodes ${\boldsymbol{y}_n}\rightarrow \boldsymbol{z}_n$ that are a hidden variables (not observable/shaded)
    - likelihood can be written as a prod over the $N$ observable $\boldsymbol{x}$ nodes, where for each $n$-th node we account for all other $\boldsymbol{z}_{1:N}$ hidden nodes (classification labels in this example): $p(\mathcal{D}\mid\boldsymbol{\theta})=\prod_{n=1}^{N}\sum_{\boldsymbol{z}_{n}}p(\boldsymbol{z}_{n}\mid\theta_{z})p(\boldsymbol{x}_{n}\mid\boldsymbol{z}_{n},\boldsymbol{\theta}_x)$
    - since the log-likelihood doesn't distribute over hidden nodes: $l(\theta)=\sum_{n=1}^{N}\log{\left[\sum_{\boldsymbol{z}_{n}}\ldots\right]}$.  We can't compute the MLE nor posterior for each node independently! 
    - this is where optimization methods (eg. expectation maximization EM) come to save the situation 
        - we'll focus on optimization methods for MLE and leave Bayesian inference for latter chapters!
        
        
        
#### 4.2.7.5 Using EM to fit CPTs in the incomplete data case
- The Expectation-Maximization (EM) [[Lau95](https://www.sciencedirect.com/science/article/pii/0167947393E0056A)] algorithm is an iterative approach for MLE in the presence of latent variables (in depth - Sec.6.5.3)
- Consists of two main steps: E-step and the M-step
    - 1) Initialize the parameters of the model, including any latent variables.
    - 2) E-step: Estimate the expected value of the latent variables $\boldsymbol{z}_n$ given the observed data and the current parameter estimates $\Rightarrow$ rather than returning the full posterior we return **Estimated Sufficient Stats (ESS)**
    - 3) M-step: Maximize the likelihood of the observed data by updating the parameter estimates based on the ESS/expected values of the latent variables obtained in the E-step
    - 4) Repeat steps 2 and 3 until convergence is achieved, i.e., the change in the parameter estimates is below a certain threshold or the log-likelihood of the observed data no longer increases.
- See book for EM example based on Sec.4.2.7.2


#### 4.2.7.6 Using SGD to fit CPTs in the incomplete data case
- In the same scenario as above (Sec.4.6.7.5). **Stochastic Gradient Descent (SGD)** [[BC94](https://watermark.silverchair.com/neco.1994.6.2.307.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAA18wggNbBgkqhkiG9w0BBwagggNMMIIDSAIBADCCA0EGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMXaZxZitVAOclrvUfAgEQgIIDEnK7d6u82QVYgd6ENpHqmBFZhb1ciIj1YnXsRBw8F1t3d2_KfX0sPAC-ObCkxiJE9C4mIEOjQ0jRHSEif7GEr7zE2Yqjq0f7JxWs_U0hC328rV1m8mK1TEwf1HKVzJ70LaFHBGMtkIEHDZd1YlCjLIMHqtmYGgDtvdVq0MJCqC8CmisaE5W6urmlHuv1OpSRzsLIDrvlGc3pROfbTalXT_tMrC3uWeyD_9Ksrdc8mfZ549eB5YdEx4zE8rq8OkWIBF7_hFvsIVCE2xsR3j2CKvG3-tP-nRLCLJ_ipxuOyyZ5DXEGFWkDLsEanNkNrllFi5nztgcIGu6icTeMoZR3BZpjq_OobaxMTY_jKKuWX2u3n46MfMKVpy0pJKgVmavZIZXrmm-tPaNkDcu13PGs7UurjcP_cskflad-tnWeLtJEObrnYQUFrIOE8lSCNrIuumNwKz_wm5RGbx6luWmnh6AF9oYGt7XScLiYP0uVFgFkwGPczIGT7qZsp_YUwFCCSQwR3PaYwfMZJcem6KdgACSt5cuFqh_NrlMV5eprpWzNrphJgp4ThuPPRiEIEB_lyntDw915jtKeQ1U30ZRXDb31TwZc1ZcuFeZHwMAowegX8Z0Hd6UPkTflYsR1OIelgwpv0upwN-59r2p_E9libMJZVFaKkusgOCeyOQBs1gcEYkdZE3VL1fU4LwVpcWDcf3MWe0cZM0KxK_QIZUeqdnRLWP2jWokIUkk7jyN3I48-raYOqI4G96OV3qvHP59oKEidrTHqBM0dAzB1IEKN1k5xXqrnrsCc5Us8fGWm8K8Up01gwwThczZSYHYFSV2KWr47QaxdL2wRllhQp54lbJ7Kq3QAoh31j_DGViejfb15S4j3d5YemUhIY7_lrvitBgEXgiQ4OoHt5wprFoT8SbLwILl9YNxvFWrC4souicxPRNfYNaXjmUYjpkfUmi35P5Vkb8_qoQHCkoyaCZNaavpKg8UDqI8tna7vPcU56aeXRucev5U1mXHWpDyMFeSOK1kKiV77yxAVlsAyEu5RGwy7nw); [Bin+97](https://link.springer.com/content/pdf/10.1023/A:1007421730016.pdf)] instead of EM is more common because is a scalable batch algorithm
- The steps are:
    - *Collapse* the model by MARGINALIZING OUT $\boldsymbol{z}_{n}$ from the marginal likelihood for each $n$-th node-observation $\boldsymbol{x}_{n}$ as: $p(\boldsymbol{x}_{n}\mid\boldsymbol{\theta})=\sum_{\boldsymbol{z}_{n}}p(\boldsymbol{z}_{n}\mid\boldsymbol{\theta}_{z})p(\boldsymbol{x}_{n}\mid\boldsymbol{z}_{n},\boldsymbol{\theta}_{x})$
    - the log-likelihood is: $\log{p(\mathcal{D}\mid\boldsymbol{\theta})}=l(\boldsymbol{\theta})=\sum_{n=1}^{N}\log{p\left(\boldsymbol{x}_{n}\mid\boldsymbol{\theta}\right)}$
    - then its gradient can be computed with MINI-BATHC apprx: $\nabla_{\boldsymbol{\theta}}l(\boldsymbol{\theta})=\ldots=\sum_{n}\sum_{\boldsymbol{z}_n}p(\boldsymbol{z}_{n}\mid\boldsymbol{x}_{n},\boldsymbol{\theta})\nabla_{\boldsymbol{\theta}}\log{p(\boldsymbol{x}_{n},\boldsymbol{z}_{n}\mid\boldsymbol{\theta})}$
    
### 4.2.8 Plate notation
- To simplify the visual picture we can use *plate notation* (See Fig.4.11)

<img src='Learning/images/probml/ch0428-plate-notation.png' width='80%'>

- to reinstate whats on Fig.4.11 we can write $N$ nodes/observables $\mathcal{D}=\{\boldsymbol{x}_{1},\ldots,\boldsymbol{x}_{N}\}$ all depending on the param $\theta$:
    - as being drawn from: $\boldsymbol{x}_{n}\sim p(\boldsymbol{x}\mid\boldsymbol{\theta})$
    - its joint dist is: $p(\mathcal{D}\mid\boldsymbol{\theta})=p(\boldsymbol{\theta})p(\mathcal{D}\mid\boldsymbol{\theta})$
    - assuming iid we can write the likelihood as: $p(\mathcal{D}\mid\boldsymbol{\theta})=\prod_{n=1}^{N}p(\boldsymbol{x}_{n}\mid\boldsymbol{\theta})$
- Other vefry illustrative exmples include Fig.4.12 and Fig.4.13 below

<img src='Learning/images/probml/ch0428-plate-notation2.png' width='80%'>


#### 4.2.8.1 Example: factor analysis
- The plate notation in Fig.4.11 supposes a model of the form: $p(\boldsymbol{z})=\mathcal{N}(\boldsymbol{z}\mid\boldsymbol{\mu}_{0},\boldsymbol{\Sigma}_{0})$ and $p(\boldsymbol{x}\mid\boldsymbol{z})=\mathcal{N}(\boldsymbol{x}\mid\mathbf{W}\boldsymbol{z}+\boldsymbol{\mu}\boldsymbol{\Psi})$ 
    -  (will explore deeper in Sec.28.3.1)
    

#### 4.2.8.2 Example: naive Bayes classifier
- Naive because we assume CI between $\boldsymbol{x}_{1:N}$ in Fig.4.13, althought this assumption may not be accurate its easy to compute: $p(\boldsymbol{x},y\mid\boldsymbol{\theta})=p(y\mid\boldsymbol{\pi})\prod_{d=1}^{D}p(x_d\mid y,\boldsymbol{\theta}_{d})$, where $\boldsymbol{\theta}=\left(\boldsymbol{\pi},\boldsymbol{\theta}_{1:D,1:C}\right)$

#### 4.2.8.3 Example: realxing the naive Bayes assumption
- If we have (uni)directed relations between selcted $\boldsymbol{x}_n$ then we have a more complex topology and we rely less strongly on the *naive Bayes* assumption aka **tree-augmented naive Bayes classifier (TAN)** (see Fig.4.14 in book)

## 4.3 Undirected graphical models (Markov random fields)
- We've seen DGPMs/DAGs (Sec.4.2) the other side of the graphical model family are **Undirected Probabilistic Graphical Models (UPGMs)/Markov Random Fields (MRFs)**
    - we are not guaranteed a simple topological (directional) order $\Rightarrow$ we can't use the chain rule to represent the graph's joint dist $p(\boldsymbol{x}_{1:N_{G}})$ 
    - next best thing is to define **potentials** with each **maximal cliques** $\psi_{c}(\boldsymbol{x}_{c};\boldsymbol{\theta}_{c})$ ie. subsets of nodes that all are neighbors of each other.
    
#### 4.3.1.1 Hammersley-Clifford theorem
- Assuming a joint distribution that satisfies the CI properties for UPGMs (will be defined in Sec 4.3.6) then the **Hammersley-Clifford** theorem is:
    - $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta}_{c})}\prod_{c\in\mathcal{C}}\psi_{c}(\boldsymbol{x}_{c};\boldsymbol{\theta}_{c})$
    - where the partition function $Z(\boldsymbol{\theta})=\sum_{\boldsymbol{x}}\prod_{c\in\mathcal{C}}\psi_{c}(\boldsymbol{x}_{c};\boldsymbol{\theta}_{c})$ normalizes the dist to 1
    - `cool fact.- part func is Z because of 'Zustandssumme' which means 'sum over states' pretty literal as expected comming from a German brain`


#### 4.3.1.2 Gibbs distribution
- **Gibbs dist/Energy based model** is a joint dist that generalizes the above by writting a potential non-zero function $\mathcal{E}$ for each clique as an energy term (lots of cool analogies from Stat Mech) so the dist is $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp{\left(-\mathcal{E}(\boldsymbol{x};\boldsymbol{\theta})\right)}$, where
    - $\mathcal{E}(\boldsymbol{x};\boldsymbol{\theta})=\sum_{c\in\mathcal{C}}\mathcal{E}(\boldsymbol{x}_{c};\boldsymbol{\theta}_{c})$, with $\mathcal{E}(\boldsymbol{x}_{c};\boldsymbol{\theta}_{c})\geq 0 \; \forall c\in\mathcal{C}$
    - the energy-clique relation is: $\psi_{c}(\boldsymbol{x};\boldsymbol{\theta})=\exp{\left(-\mathcal{E}(\boldsymbol{x};\boldsymbol{\theta})\right)}$
    
    
### 4.3.2 Fully visible MRFs (Ising, Potts, Hopfield, etc.)
- Used in Stat Mech and computer vision and Biological Physics. We'll see the not-fully visible cases latter on 



#### 4.3.2.1 Ising model
- A binary system (spin-up / spin-down from Physics) the joint dist is defined for immediate nearest neighbors $i\sim j$ (counts same pairs only once prevents double counting):
    - $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\theta)}\prod_{i\sim j}\psi_{ij}\left(x_{i},x_{j};\boldsymbol{\theta}\right)$
        - the two cases are: $\psi_{i j}\left(x_i, x_j ; \boldsymbol{\theta}\right)= \begin{cases}e^{J_{i j}} & \text { if } x_i=x_j \\ e^{-J_{i j}} & \text { if } x_i \neq x_j\end{cases}$
    - since we have the same magnitude $J$ (*copuling strength*) the states only differ in sign, thus:
        -  $\psi_{i j}\left(x_i, x_j ; J\right)= \begin{cases}e^{J} & \text { if } x_i=x_j \\ e^{-J} & \text { if } x_i \neq x_j\end{cases}$
        - then the joint dist is: $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp{\left(-\mathcal{E}(\boldsymbol{x};J)\right)}$
        - with: $\mathcal{E}(\boldsymbol{x};J)=-J\sum_{i\sim j}x_{i}x_{j}$, where the pair $x_{i}x_{j}$ is $-1$ ($+1$) when $x_i=x_j$ ($x_i\neq x_j$) 
        - moreover, if all contributions are $+J>0$ ($-J<0$) in ML this is known as an **associative Markov network** in Physics **ferromagnet** (**antiferromagnet/frustrated system** $\Rightarrow$ neighbors can't be in same spin/state thus system has many solutions)
- if we study an approx infinite lattice we see that there is a *critical* temperature for which clusters will form, this emerges alongside larger values of $J\geq J_{c}$ 
    - isotropic case has shown [[Geo88](https://books.google.ca/books?hl=en&lr=&id=3vMCnvMH-hkC&oi=fnd&pg=PR7&dq=gibbs+measures+and+phase+transitions+1988&ots=kzJfPJNbQv&sig=USObALiUs8W-96YGKcikldzot28&redir_esc=y#v=onepage&q=gibbs%20measures%20and%20phase%20transitions%201988&f=false)]: $J_{c}=\frac{1}{2}\log{(1+\sqrt{2})}\approx 0.44$
- More complete model introduces external fields (acting on unary terms $\psi_i(x_i)$) which result in: $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\prod_{i}\psi(x_i;\boldsymbol{\theta})\prod_{i\sim j}\psi(x_i,x_j;\boldsymbol{\theta})$ where $\psi_{i}(x_i)=\begin{cases}e^{\alpha} & \text { if } x_i=+1 \\ e^{-\alpha} & \text { if } x_i=-1 \end{cases}$
    - written as an energy model: $\mathcal{E}(\boldsymbol{x}\mid\boldsymbol{\theta})=-\alpha\sum_{i}x_i -J\sum_{i\sim j}x_ix_j$
        

#### 4.3.2.2 Potts
- Generalizes the Ising model for $k$ possible states, so $\psi_{ij}(x_i=k,x_j=k^{\prime})=\exp{[J_{ij}(k,k^{\prime})]}$
- Potts is the special case when same-neigbor-states contribute same magnitude $J$ such that: $\psi_{ij}(x_i=k,x_j=k^{\prime})=\begin{cases}e^{J} & \text { if } k=k^{\prime} \\ e^{0} & \text { if } k \neq k^{\prime}\end{cases}$
    - Meaing that when $J>0$ neighboors are encouraged to have the same label (thus the name *Markov associative* model)
    - when Potts $J_{\text{potts}}=2J_{\text{ising}}$ model reduces to Ising
    - phase transistion (in Potts 2D) occurs at [[MS96](https://iopscience.iop.org/article/10.1088/0305-4470/28/6/012/meta?casa_token=GPFPgd26oiEAAAAA:uBLoJ2B8zfCTgrzp_OzQrULGPC1pZKTDBCDKP0f7-XWZ7_dZgGL43lTNbBiFvyvKmOp8fPp6smf92MeMteGZQOWxbpg)]: $J_c=\log{(1+\sqrt{K})}$
- More general formulation, adding an external field, the energy model is: $\mathcal{E}(\boldsymbol{x}\mid\boldsymbol{\theta})=-\sum_{i}\sum_{k=1}^{K}\alpha_{k}\mathbb{I}(x_i=k)-J\sum_{i\sim j}\mathbb{I}(x_i=x_j)$

#### 4.3.2.3 Potts models for protein structure prediction
- Potts model has been long used for the infamous *protein folding problem* which is in short: predicting a 3D structure from a starting 1D chain sequence of amino acids. (See book and other chapters for more)


#### 4.3.2.4 Hopfield networks
- Popular in the past (80s) but now we use DL approaches
    - Considers a fully connected Ising model with a symetric weight $\mathbf{W}=\mathbf{W}^{\top}$ so the energy is: $\mathcal{E}(\boldsymbol{x})=-\frac{1}{2}\boldsymbol{x}^{\top}\mathbf{W}\boldsymbol{x}$
    - was useful for *associative memory* or *content-addressable memory* 


### 4.3.3 MRFs with latent  variables (Boltzmann machines, etc.)
- Useful to represent high dimensional joint distributions in discrete spaces and with latent vars


#### 4.3.3.1 Vanilla Boltzmann machines
- In a MRF, if all nodes are visible $\Rightarrow$ the expressive power is limited! Because the only way to model correlation is by adding another edge.
    - Boltzmann machines solve this by introducing latent vars $\boldsymbol{z}$ appart from visible nodes $\boldsymbol{x}$. Basically is an Ising model but structure can be arbitrary (rather than just a lattice) and states are $x_i\in \{0,1\}$
- Unfortunately inference (& learning) is intractable, not even using Gibbs sampling!



#### 4.3.3.2 Restricted Boltzmann machines (RBMs)
- **RBMs** are bipartite nets that extend model expressiveness because they consider $K_z$ hidden nodes $\boldsymbol{z}$ that enable complex CI representations given the visible nodes $\boldsymbol{x}$ so: $p(\boldsymbol{z}\mid\boldsymbol{x})=\prod_{k=1}^{K_z}p(z_k\mid\boldsymbol{x})$
    - *bipartite net* (=two groups). RBMs are two *fully connected layers w/o connections within each layer*
    - the energy is proportional to sandwiching: $\boldsymbol{w}^{\top}_{k}\boldsymbol{x}z_k$ and because hidden & visible nodes in RBMs are typically binary we get $\Rightarrow$ $p(\boldsymbol{x}\mid\boldsymbol{z})=\prod_{k;z_k=1}\exp(\boldsymbol{w}^{\top}_k\boldsymbol{x})$
- A **product of experts** (Sec.24.1.1) can be used to model the joint distribution of the visible and hidden units in an RBM eg. by tuning constraints via hidden units $z_k=0,1$. These can be though as *mixture models* w/ exponential num of hidden components ie. $2^H$ settings for $\boldsymbol{z}$. From here we can make two distinctions:
    - **distributed representations** refer to fully connected bipartite RBMs plus constraint-tuning via hidden units that modulate the network architecture ($z_k=0,1$). Dist reps are more robust and efficient for representing complex data structures that have **componential** structure.
    - `componential def.-  In logistics, componential refers to a part or combination of parts having a specific function that can only be installed or replaced as an entity`
    - **localized representation** each concept or feature is represented by a single unit


### 4.3.3.3 Deep Boltzmann Machines
- Achieved by stacking multiple RBMs [[SH09](https://proceedings.mlr.press/v5/salakhutdinov09a)] eg. a two layer RBM would be: $p(\boldsymbol{x},\boldsymbol{z}_1,\boldsymbol{z}_2\mid\boldsymbol{\theta})=\frac{1}{\mathbf{Z}(\mathbf{W}_1,\mathbf{W}_2)}\exp{(\boldsymbol{x}^{\top}\mathbf{W}_1\boldsymbol{z}_1+\boldsymbol{z}_1^{\top}\mathbf{W}_2\boldsymbol{z}_2)}$
    - dropped the bias terms for brevity
    - see Fig.4.22(a) for visual picture. Note that Deep Boltzmann machines are UPGMs whereas Deep belief nets are DPGMs
    
    
#### 4.3.3.4 Deep belief/Boltzmann networks (DBNs)
- We can use a RBM as a prior for a DPGM (see Fig.4.22(b)) ie. the DBN is a RBM used to decode the visible units dependent on hparams: $p(\boldsymbol{x},\boldsymbol{z}_1,\boldsymbol{z}_2\mid\boldsymbol{\theta})=p(\boldsymbol{x}\mid\boldsymbol{z}_1,\mathbf{W}_1)\frac{1}{\mathbf{Z}(\mathbf{W}_2)}\exp{(\boldsymbol{z}_1^{\top}\mathbf{W}_2\boldsymbol{z}_2)}$
    - strictly speaking this is NOT a belief net, thus a more correct name is **Deep Boltzmann Network** (also abbrv. DBN)
    - DBNs were important in old DL days, but now are OBSOLETE. They've been replaced by ReLUs, Adam optimizers
    
<img src='Learning/images/probml/ch04334-deep-boltzmann-nets.png' width='80%'>
    
### 4.3.4 Maximum entropy models
- Are probailistic models used to estimate a dist based on incomplete info and are based on the principle of *maximum entropy*: the best candidate model is the one that maximizes the entropy subject to our prior knowledge
- We've seen in Sec.2.4.7 that the **Exponential Family** is the distribution fam w/ *maximum entropy* subject to:
    - the constraints that the expected values of features (sufficient stats) $\phi(\boldsymbol{x})$ match the empirical expectations
    - has the general form: $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp(\boldsymbol{\theta}^{\top}\phi(\boldsymbol{x}))$
    
#### 4.3.4.1 Log-linear models
- Log-linear models have a potential/clique: $\psi_c(\boldsymbol{x}_c;\boldsymbol{\theta}_c)=\exp(\boldsymbol{\theta}_c^{\top}\phi(\boldsymbol{x}_c))$ thus $\Rightarrow$ the model is sums over all cliques: $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp{\left(\sum_c\boldsymbol{\theta}_c^{\top}\phi(\boldsymbol{x}_c)\right)}$ 
    - where *sufficient stats* can take many forms, ie. Gaussian Graphical model (Ising) $\phi(x)=[x_i,x_j,x_ix_j]$ where $x_\ast\in\mathbb{R}$ ($x_\ast\in\{-1,1\}$)
    - since GGM has the same form as Boltzmann machnines, we have to make the distinction that computing $Z(\boldsymbol{\theta})$ takes $O(D^3)$ time for GGMs whereas it takes $O(2^D)$ times for Boltzmann machines
    

#### 4.3.4.2 Feature induction for maxent spelling
- Nowadays an obsolete model, in any case it goes like this: 
    - in some problems the features $\phi(\boldsymbol{x})$ are known but its also possible to learn them in an unsupervised way. This is known as **feature induction**
    - the general approach is to start w/ a base of initial features and then build up more, out of combinations from the base ones. After each feature addition we re-fit by MLE-ing $\hat{\theta}_i$
    - eg. *feature induction in maxent spelling* - aims to build english spelling lang. 
        - Starts w/ a base features of lowecase characters $\phi_i(\boldsymbol{x})=\sum_i\mathbb{I}(x_i\in\{a,\ldots,z\})$, then fit to find $\hat{\theta}_i$. 
        - Then, we can add another feature ie. lowercase characters checker $\phi_2(\boldsymbol{x})=\sum_{i\sim j}\mathbb{I}(x_i,x_j\in\{a, \ldots,z\})$ and re-fit
        - Lastly, (if we wish to stop feature induction here) the model would be: $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z}\exp(\theta_1\phi_1(\boldsymbol{x})+\theta_2\phi_2(\boldsymbol{x}))$
        - Moreover, if we define a feature for every combination of words we then can represent ANY dist!
        
### 4.3.5 Gaussian MRFs
- Sec.4.2.3 was about representing a MVN/Gaussian as a DPGM, now we represent it in an UPGM, see more [[RH05](https://books.google.com.bo/books?hl=en&lr=&id=TLBYs-faw-0C&oi=fnd&pg=PP1&dq=gaussian+markov+random+fields+theory+and+application&ots=RO2RuKTtmW&sig=OIrHNCiogY5tCJe0NFKNXzCcevs&redir_esc=y#v=onepage&q=gaussian%20markov%20random%20fields%20theory%20and%20application&f=false)].


#### 4.3.5.1 Standard GMRFs
- **Gaussian MRF** is a pairwise MRF: $p(\boldsymbol{x})=\frac{1}{Z(\boldsymbol{\theta})}\prod_{i\sim j}\psi_{ij}(x_i,x_j)\prod_i\psi_i(x_i)$, where
    - edge potentials/pariwise terms: $\psi_{i\sim j}(x_i,x_j)=\exp(-\frac{1}{2}x_i\Lambda_{ij}x_j)$
    - external fields/unary terms: $\psi_i(x_i)=\exp(-\frac{1}{2}\Lambda_{ii}x_i^2+\eta_{i}x_i)$
    - partition func: $Z(\boldsymbol{\theta})=(2\pi)^{D/2}|\boldsymbol{\Lambda}|^{-1/2}$
- We can write the *joint dist* in a more familiar form ie. **information form**: $p(\boldsymbol{x})\propto\exp[\boldsymbol{\eta}^{\top}\boldsymbol{x}-\frac{1}{2}\boldsymbol{x}^\top\boldsymbol{\Lambda}\boldsymbol{x}]$, where the canonical params are $\boldsymbol{\Lambda}=\boldsymbol{\Sigma}^{-1}$ and $\boldsymbol{\eta}=\boldsymbol{\Lambda}\boldsymbol{\mu}$
- IMPORTANT! The connectivity matrix $\boldsymbol{\Lambda}_{ij}$ is often sparse ($\Lambda_{ij}=0$ indicates CI $x_i\perp x_j\mid\boldsymbol{x}_{-ij}$) thus we can use **$l_1$ regularization/graphical lasso**  on the weights to learn the sparse graph
    - however, the fact that precision matrix $\boldsymbol{\Lambda_{ij}}$ is sparse DOES NOT mean that covariance $\boldsymbol{\Sigma}=\boldsymbol{\Lambda}^{-1}$ is sparse! Because in UPGMs pair-nodes are at least marginally correlated


#### 4.3.5.2 Nonlinear Gaussian MRFs
- A more general formulation of the previous section is considering nonlinearities: $p(\boldsymbol{x})=\frac{1}{Z}\prod\psi_c(\boldsymbol{x}_c)$, where cliques are $\psi_c(\boldsymbol{x}_c)=\exp(-E_c(\boldsymbol{x}_c))$
    - the most general form for the energy is: $E_c(\boldsymbol{x}_c)=\frac{1}{2}(f_c(\boldsymbol{x}_c)-\boldsymbol{d}_c)^{\top}\boldsymbol{\Sigma}^{-1}(f_c(\boldsymbol{x}_c)-\boldsymbol{d}_c)$, where:
        - we can model linear & nonlinearities w/ a measurement func $f_c$. If linear $f_c(\boldsymbol{x})=\mathbf{J}_c\boldsymbol{x}+\boldsymbol{b}_c$ ($\mathbf{J}_c$ is Jacobian) we recover the standard Gaussian energy (Sec.4.3.5.1). If nonlinear we often linearize it (via expansion around $\boldsymbol{x}_c^0$)
        - and some optional local evidence $\boldsymbol{d}_c$
        
        
### 4.3.6 Conditional Independence properties
- Sec.4.2.4 described CI propoerties for DPGMs now this section is all about how UPGMs **encode** conditional independence assumptions


#### 4.3.6.1 Basic results
- UPGMs define CI properties via simple graph separations (as opposed to d-separations in DPGMs): given three set of nodes $A, B, C$ we say that $\mathbf{X}_A\perp\mathbf{X}_B\mid\mathbf{X}_C$ iif $C$ separates $A$ from $B$ in the graph $G$
    - **(G) Global Markov property** - when theres no path connecting $A$ to $B$ if we remove the $C$ nodes
    - **(L) Local Markov property** - in UPGMs a node's *markov blanket* is its set of immediate neighbors
        - *Markov Blankets* - smallest set of nodes that render a node $t$ CI from all other nodes: $t\perp\nu\diagdown \text{cl}(t)\mid\text{mb}(t)$, where $\nu=\{1,\ldots,N_G\}$: set of all nodes, $\text{cl}(t)= \text{mb}(t)\bigcup \{t\}$: closure of node $t$
    - **(P) Pairwise Markov property** - derived easily from (L), two nodes are CI given the rest if theres no link between them: $s\perp t\diagdown\nu\{s,t\}\Leftrightarrow G_{st}=0$, where $G_{st}=0$: no edge between $s$ & $t$
    
<img src='Learning/images/probml/ch04361-ci-properties-upgm.png' width='60%'>
    
#### 4.3.6.2 An undirected alternative to d-separation
- We've seen how much easier is to identify CI in UPGMs in contrast to DPGMs because we don't have to worry about directionality (ie. no rolling Bayes ball needed)
- **moralization** is the process of converting a DPGM into an UPGM via adding connections between the unmarried nodes (in v-structures) and then dropping the directionality/arrows


### 4.3.7 Generation (sampling)
- UPGMs are a lot more costly to sample as opposed to DPGMs because: 
    - (i) there is no ordering of variables so sampling the prior is hard and 
    - (ii) we need $Z$ to compute any configuration
- It is common to use MCMC for generating UPGM graphs, we'll dive more in Chap.12 
- In the special case of low treewidth-UPGMs, dicrete or Gaussian potentials we can use the *junction tree algorithm* to sample using *dynamic programming* (see Supp.9.2.3)


### 4.3.8 Inference
- More details in Chap.9. For now, we just unveil one example of inference - suppose we observe a binary-valued pixel $z_i$ image, but measurements $x_i$ are noisy
- Joint dist is a hybrid directed-undirected model: $p(\boldsymbol{x}, \boldsymbol{z})=p(\boldsymbol{z})p(\boldsymbol{x}\mid\boldsymbol{z})=\left[\frac{1}{Z}\sum_{i\sim j}\psi_{ij}(z_i,z_j) \right]\prod_ip(x_i\mid z_i)$, (called **chain graph** eventhough is not chain-structured) where
    - $p(\boldsymbol{z})$ is an UPGM prior (Ising model)
    - $p(x_i\mid z_i)=\mathcal{N}(x_i\mid z_i,\sigma^2)$ is a DPGM Gaussian likelihood for $z_i\in\{-1,+1\}$
- Exact inference is intractable for large graphs (Sec.9.5.4), but we some methods are available: mean field variational inference (Sec.10.3.2), Gibbs sampling (Sec.12.3.3), loopy belief propagation (Sec.9.4), ...

### 4.3.9 Learning
- This section dives into how to estimate params in a MRF.
    - we'll see the **doubly intractable** problem of computing: (1) MLE because $Z(\boldsymbol{\theta})$ is too costly and (2) the posterior $p(\boldsymbol{\theta}\mid\boldsymbol{x})$ is even harder because of the normalization constant $p(\mathcal{D})$

#### 4.3.9.1 Learning from complete data
- The simplier linear MLE case for energy based models has the form (Sec.24.2 treats the nonlinear one): $p(\boldsymbol{x}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp\left(\sum_c \theta_c\phi_c(\boldsymbol{x})\right)$, where $c$ accounts for cliques
    - then the log-likelihood is: $l(\boldsymbol{\theta})=\frac{1}{N}\sum_n \log p(\boldsymbol{x}_n\mid\boldsymbol{\theta})$
    - next, using **moment matching** (equating the grad to zero) yields: $\frac{\partial l}{\partial{\boldsymbol{\theta}}}=0=\frac{1}{N}\sum_n\phi_c(\boldsymbol{x}_n)-\mathbb{E}[\phi_c(\boldsymbol{x})]$ $\Rightarrow$ expected value of features according to the data (**clamped/positive phase** $\mathbb{E}_{p\mathcal{D}}[\phi_c(\boldsymbol{x})]$) is equal to the expected value of features according to the model (**unclamped/negative phase** $\mathbb{E}_{p(\boldsymbol{x}\mid\boldsymbol{\theta})}[\phi_c(\boldsymbol{x})]$)
    - lastly, we estimate params using gradient methods. In the particular case of MRFs w/ tabular potentials we can use a method called **iterative proportional fitting (IPF)** to solve the system of equations
    
    
#### 4.3.9.2 Computational issues
- Unfortunately the cost for computing MRFs (& CRFs) params using MLE is serverely expensive. Part of the *double intractable* problem is computing the log partition func needed to obtain the derivative of the log-likelihood
- Simplifying the math, the bottleneck arises in the **log-derivative trick** $$\nabla_{\boldsymbol{\theta}}\log\tilde{p}(\boldsymbol{x};\boldsymbol{\theta})=\frac{1}{\tilde{p}(\boldsymbol{x};\boldsymbol{\theta})}\nabla_{\boldsymbol{\theta}}\tilde{p}(\boldsymbol{x};\boldsymbol{\theta})$$ 
    - $$\nabla_{\boldsymbol{\theta}}\log Z(\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\int \nabla_{\boldsymbol{\theta}}\tilde{p}(\boldsymbol{x};\boldsymbol{\theta})d\boldsymbol{x}=\mathbb{E}_{\boldsymbol{x}\sim p(\boldsymbol{x};\boldsymbol{\theta})}[\nabla_{\boldsymbol{\theta}}\log \tilde{p}(\boldsymbol{x};\boldsymbol{\theta})]$$
    - thus we need to draw samples at EACH step of the SGD training just to estimate the gradient
- Future chapters discuss efficient sampling methods ie. *gradient-based MCMC* (Sec.24.2.1), and alternative estimators instead of MLE eg. *contrastive divergence* (Sec.24.2.2) & *maximum pseudo-likelihood estimation* (Sec.4.3.9.3) 
    - see [[Sto17](https://arxiv.org/abs/1704.03331)] for a great review on param estimation in MRFs
    
#### 4.3.9.3 Maximum pseudolikelihood estimation
- An alternative to maximizing the likelihood we can maximize the *pseudo likelihood* - it predicts each node $x_d$ given all neighbors $\boldsymbol{x}_{-d}$. The objective is easier to compute because the full-conditional for each $d$-th node (and all $N$ datapoints) $p(x_d\mid\boldsymbol{x}_{-d},\boldsymbol{\theta})$ only sums over the states of such node
    - defined as: $l_{PL}(\boldsymbol{\theta})=\frac{1}{N}\sum_{n=1}^N\sum_{d=1}^{D}\log{p(x_{nd}\mid\boldsymbol{x}_{n,-d},\boldsymbol{\theta})}$
    - experiments have claimed that it has comparable quality in its estimations but being a lot faster for Ising, Potts models
    - we'll discuss more state of the art estimation methods in Sec.24.2
    
#### 4.3.9.4 Learning from incomplete data
- Sec.4.3.9.1 showed learning from complete data, now we face incomplete data 
    - eg. we want to learn a model of the form $p(\boldsymbol{z})p(\boldsymbol{x}\mid\boldsymbol{z})$, ie. aims to learn the clean version $\boldsymbol{z}$ of some noisy/corrupted observations $\boldsymbol{x}$ (only observing $\boldsymbol{x}$ is called a **hidden Gibbs distribution** Sec.10.3.2)
- For simplicity consider MRFs (not CRFs), dropping the summ over cliques $c$ and assume log-linear potentials: $p(\boldsymbol{x},\boldsymbol{z}\mid\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{\theta})}\exp\left(\boldsymbol{\theta}^\top\phi(\boldsymbol{x},\boldsymbol{z})\right)=\frac{\tilde{p}(\boldsymbol{x},\boldsymbol{z}\mid\boldsymbol{\theta})}{Z(\boldsymbol{\theta})}$
    - where: $\tilde{p}$ is the unnormalized dist and  $Z(\boldsymbol{\theta})=\sum_{\boldsymbol{x},\boldsymbol{z}}\exp\left(\boldsymbol{\theta}^\top\phi(\boldsymbol{x},\boldsymbol{z})\right)$
    - following the same steps as for the 'complete data' case we get the log-likelihood: $l(\boldsymbol{\theta})=\frac{1}{N}\sum_{n=1}^N\log\left(\sum_{\boldsymbol{z}_n}p(\boldsymbol{x}_n,\boldsymbol{z}_n\mid\boldsymbol{\theta})\right)=\frac{1}{N}\sum_n\log{Z(\boldsymbol{\theta},\boldsymbol{x}_n)}-\log{Z(\boldsymbol{\theta})}$ 
    - finally the estimates are: $\frac{\partial{l}}{\partial{\boldsymbol{\theta}}}=0=\frac{1}{N}\sum_n\left[\mathbb{E}_{\boldsymbol{z}\sim p(\boldsymbol{z}\mid\boldsymbol{x}_n,\boldsymbol{\theta})}[\phi(\boldsymbol{x}_n,\boldsymbol{z})]\right]-\mathbb{E}_{(\boldsymbol{x},\boldsymbol{z})\sim p(\boldsymbol{z},\boldsymbol{x}\mid\boldsymbol{\theta})}[\phi(\boldsymbol{x},\boldsymbol{z})]$ 

## 4.4 Conditional random fields (CRFs)
- Is a MRF defined on a set of related label nodes $\boldsymbol{y}$, whose joint prob depends ONLY on a set of input nodes $\boldsymbol{x}$ (meaning its partition function depends on both $\boldsymbol{x},\boldsymbol{\theta}$): $p(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{x},\boldsymbol{\theta})}\prod_{c}\psi_c(\boldsymbol{y}_c;\boldsymbol{x},\boldsymbol{\theta})$
    - potentials can have a nonlinear form such as in DNNs or the log-linear form $\psi_c(\boldsymbol{y}_c;\boldsymbol{x},\boldsymbol{\theta})=\exp(\boldsymbol{\theta}_c^\top\phi_c(\boldsymbol{x},\boldsymbol{y}_c)$ (being the *conditional* version of the log-linear we've seen in Sec.4.3.4)
    - CRFs capture depedencies of output labels $\boldsymbol{y}\in\mathcal{Y}$ given the inputs $\boldsymbol{\theta}$ thus are good for **structured prediction** eg. object recognition (objects have different lables), NLP (noun-phrase must precede verb-phrase)
    
### 4.4.1 3D CRFs
- Used in the past for NLP in 1980-2010s, now OBSOLETE, has been replaced by RNNs and then transformers
- A CRFs in a chain structure is a sequence $\boldsymbol{y}_{1:T}$, we'll use the examplpe to represent words in sentences, as: $p(\boldsymbol{y}_{1:T}\mid\boldsymbol{x},\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{x},\boldsymbol{\theta})}\prod_{t=1}^T\psi(y_t,\boldsymbol{x}_t);\boldsymbol{\theta}\prod_{t=2}^T\psi(y_{t-1},y_t;\boldsymbol{\theta})$, where
    - node potentials $\psi(y_t,\boldsymbol{x}_t)$ represent noun-phrases in Fig.4.30
    - edge potentials $\psi(y_{t-1},y_t;\boldsymbol{\theta})$ represent 
    
#### 4.4.1.1 Noun phrase chunking


#### 4.4.1.2 Named entity recognition 


#### 4.4.1.3 Natural language parsing


### 4.4.2 2D CRFs 
- Used on image processing problems, its now OBSOLETE has been replaced by CNNs and transformers
- A conditional grid model (see Fig.4.33, contrast it with the model of Fig.4.26 Sec.4.3.8) is: $p(\boldsymbol{x}\mid\boldsymbol{z})=\frac{1}{Z(\boldsymbol{x})}\left[\sum_{i\sim j}\psi_{ij}(y_i,y_j)\right]\prod_{i}p(y_i\mid\boldsymbol{x}_i)$

#### 4.4.2.1 Semantic segmentation
- Deals with the problem of identifying the label of every pixel in an image
    - CNNs aim to achieve this via softmax outputs per pixel/node but FAILS to capture long-range dependencies
    - feeding the CNNs' output to *fully-connected CRFs* (grid CRFs doesn't improve capturing long-range dependencies) CRFsimproves segmentation [[Che+17a](https://ieeexplore.ieee.org/abstract/document/7913730?casa_token=gkAJa-qIWzsAAAAA:XiKRhsril5diX8e1aoKlGp0F9lVPGWPU9PdKShF3SAWpxQAVH1kOnm0Pyipy453nbiMfDb9JFGBS)]
    - unfortunately, CRFs computation is intractable so
        - in the case of Gaussian potentials there are workarounds using *mean field algorithms*
        - mean field algos can be implemented using RNNs
        - even better - letting the GNN graph "roll", treating it as a feedforward net allows to use gradient methods and not depend on partition func $Z$

#### 4.4.2.2 Deformable parts model
- Deals w/ the challenge of locating position of (detected) objects in Learning/images/probml
    - *Sliding window* techniques (basically using binary classifiers asking if object X is present in each image and then finding its location based on sliding) perform POORLY when Learning/images/probml are deformable or occluted eg. bodies in different positions, objects in movement... CNNs are a lot better at this (Sec.16.3.2)
    - a workaround w/ CRFs is to detect each deformable part eg. body parts and enforce spatial coherence between the parts: $p(\boldsymbol{y}\mid\boldsymbol{x})=\frac{1}{Z(\boldsymbol{\theta})}\left[\prod_{i}p(y_i\mid f_i(\boldsymbol{x})\right]\left[\prod_{(i,j)\in E}\psi(y_i,y_j\mid\boldsymbol{x})\right]$, where
        - potential between nodes representing deformable parts $i,j$ are tunned by the penalty distance: $\psi(y_i,y_j\mid\boldsymbol{x})=\exp(-d(y_i,y_j))$
        - in combination w/ the above the pixel classifier is packed in $f_i$: $p(y_i\mid f_i(\boldsymbol{x}))$
        - we can solve the global optimal joint configuration $\boldsymbol{y}^\ast=\operatorname{argmax}_{\boldsymbol{y}}(p(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta}))$ w/ brute force in $O(K^T)$ ($T$ num of nodes/parts & $K$ states/locations); w/ tree graphs $O(TK^2)$ (Sec.9.3.2); exploiding the fact that states/locations are ordinal $O(TK)$
        
### 4.4.3 Parameter estimation
- We desscribe how to perform MLE in CRFs


#### 4.4.3.1 Log-linear models
- General formulation in next Sec.4.4.3.2, for log-linear potentials in the params: $\psi(\boldsymbol{y}_c;\boldsymbol{x},\boldsymbol{\theta})=\exp(\boldsymbol{\theta}^\top_c\phi_c(\boldsymbol{x},\boldsymbol{y}_c))$
    - the log-likelihood: $l(\boldsymbol{\theta})=\frac{1}{N}\sum_n\log{p(\boldsymbol{y}_n\mid\boldsymbol{x}_n,\boldsymbol{\theta})}=\frac{1}{N}\sum_n\left[\sum_c\boldsymbol{\theta}^\top_c\phi_c(\boldsymbol{x}_n,\boldsymbol{y}_{nc}) - \log{Z(\boldsymbol{x}_n;\boldsymbol{\theta})}\right]$, where
        - $\log{Z(\boldsymbol{x}_n;\boldsymbol{\theta})}=\sum_{\boldsymbol{y}}\exp(\boldsymbol{\theta}^\top\psi(\boldsymbol{y},\boldsymbol{x}_n))$
    - derivatives: $\frac{\partial{l}}{\partial{\boldsymbol{\theta}_c}}=\frac{1}{N}\sum_n\left[\phi_c(\boldsymbol{x}_n,\boldsymbol{y}_{nc}) - \mathbb{E}_{p(\boldsymbol{y}\mid\boldsymbol{n},\boldsymbol{\theta})}[\phi_c(\boldsymbol{y},\boldsymbol{n}_n)]\right]$
    - objective term is *convex* thus we can use SGD and variants eg. *stochastic meta descent* 
    
#### 4.4.3.2 General case
- General formulation: $p(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta})=\frac{1}{Z(\boldsymbol{x};\boldsymbol{\theta})}\exp(f(\boldsymbol{x},\boldsymbol{y};\boldsymbol{\theta}))=\frac{\exp(f(\boldsymbol{x},\boldsymbol{y};\boldsymbol{\theta}))}{\sum_{\boldsymbol{y}^\prime}\exp(f(\boldsymbol{x},\boldsymbol{y}^\prime;\boldsymbol{\theta}))}$, where 
    - the scoring func $f(\boldsymbol{x},\boldsymbol{y};\boldsymbol{\theta})$ correlates w/ probable configs
- gradient: $\nabla_{\boldsymbol{\theta}}l(\boldsymbol{\theta})=\frac{1}{N}\sum_{n=1}^{N}f(\boldsymbol{x}_n,\boldsymbol{y}_n;\boldsymbol{\theta}) - \nabla_{\boldsymbol{\theta}}\log{Z(\boldsymbol{x_n};\boldsymbol{\theta})}$
    - we've seen that this is intractable (part of the *double intractable problem*, workarounds in  Sec.4.3.9.2) 
    - still costly because we need to compute derivatives for each $n$-th training example as opposed to the MRF where $\log{Z(\boldsymbol{\theta})}$ is constant independent of observations $\boldsymbol{x}$ and dependent only on params $\boldsymbol{\theta}$
    
    
### 4.4.4 Other cases  to structured prediction
- Further notable approaches to structured prediction beyond CRFs are: *graph neural networks* (Sec.16.3.6) and sequence-to-sequence models like **transformers** (Sec.16.3.5)
    - other historical notable mentions: *max margin Markov nets* [[TGK03](https://proceedings.neurips.cc/paper/2003/hash/878d5691c824ee2aaf770f7d36c151d6-Abstract.html)], *structural support vector machines* [[Tso+05](https://www.jmlr.org/papers/volume6/tsochantaridis05a/tsochantaridis05a.pdf)], *structured prediction energy models* [[BYM17](https://proceedings.mlr.press/v70/belanger17a.html)] (Chapter.24)

## 4.5 Comparing directed and undirected graphical PGMs
- There are different advantages to both, additionally these can sometimes be converted between both structures.


### 4.5.1 CI properties
- Recall Sec.4.2.4 we've seen rules to define CI properites in a graph $G$ ie. the relevant to this section are
    - $G$ is an I-map of dist $p$ if $I(G)\subseteq I(p)$ $\rightarrow$ meaning that all CI statements in $G$ are true for dist $p$


### 4.5.2 Converting between a directed and undirected model



#### 4.5.2.1 Converting a DPGM to a UPGM



#### 4.5.2.2 Converting a UPGM to a DPGM



### 4.5.3 Conditional directed vs undirected PGMs and the label bias problem
- eg. in some graph architectures UDPGMs are **globally normalized** (by $Z$) whereas DPGMs are **locally normalized** (each node's Conditional PDist is normalized). However, UPGMs trade-off comes in computation cost as oppsed to DPGMs which are easier to train be 
