---
title: 5. The Chain
date: 2024-10-26
---

- In the [[Learning/blockchain/04-blocks.md|Blocks]] write-up we've introduced a way for preventing double spends by enforcing periods of silence via a ticketing system that occurs at tunable frequency and its earned by mining Proof of Work
- We also required a notion of freshness from block to block to avoid tricking the system by withholding and spamming blocks at will

## 5.1 The Target
- Now that we've established the PoW inequality (as a moderately hard version of the expentially hard hash preimage problem) we'd like to estimate what the *difficulty param* $T$ should be to have $\Delta$ spacing between ticket/block to ticket/block
    - *Random oracle assumption* - Since the distribution of the image set of hash functions are not always uniform, for PoW we'd like to demand that they are uniformly distributed in $\{0,1\}^\kappa$
    - Guessing the right $\text{ctr}$ (in $B=s\|\vec{x}\|\text{ctr}$) for wining PoW has a probability of success of: $p=P[H(B)\leq T]=\frac{T}{2^\kappa}$
    - Lets assume that: *(i)* a node with typical computational power can process $q\in\mathbb{N}$ computations of $H$ per unit of time. *(ii)* There is $n\in\mathbb{N}$ computers in the network out of which the adversary controls $t\in\mathbb{N}$ (a more powerful computer can be thought as a collection of smaller computers with multiplicative power of $q\times\text{some-int-number}$)
- The expected number of queries until a successful query is $\frac{1}{p}=\frac{2^\kappa}{T}$, if the total number of queries that can be executed in the network is $nq$ then the expected block generation time is $\frac{1}{pnq}=\frac{2^\kappa}{Tnq}$, we require this to be greater than network delay: $\Delta<\frac{2^\kappa}{Tnq}\Rightarrow T<\frac{2^\kappa}{\Delta nq}$
    - The more computational power there is on the network the more we have to increase mining difficulty, and same applies if we want to delay the network paramenter
    - Lets define the *honest block production rate* $f$ and the expected time between two blocks being generated: $\eta=\frac{1}{f}$
        - *static difficulty model* - For now we can make use of a static/fixed $f\simeq (n-t)qp$

## 5.2 The Arrow of Time
- The chain structure is a consecuence of our intention of forcing *freshness* so that blocks from the past can't be saved and used at will. Turns out that the chain structure has more interesting properties that we'll discuss here
    - First lets introduce some notation, a chain $\mathcal{C}$ is a sequence of $n$ blocks $\mathcal{C}=(B_0,B_1,\ldots,B_{n-1})$ which has length $\left|\mathcal{C}\right|$ & is enumerated like arrays in Python starting at zero and going up to $n-1$
        - Like Python, the first **Genesis Block** is $\mathcal{G}=\mathcal{C}[0]$ & the tip is $\mathcal{C}[-1]=\mathcal{C}[|\mathcal{C}|-1]$
        - A chunk of the chain from the $i$-th (incluse) to the $j$-th (exclusive) element is $\mathcal{C}[i:j]=(B_i,\ldots,B_{j-1})$ 
- Now lets elaborate on how a block is *validated* and which other security notions against adversarial attacks are needed
    - Analogously to *simple ideas* do not work ([[Learning/blockchain/04-blocks.md#4.3-simple-ideas-dont-work|Sec.4.3]]) for avoiding double spending in transactions, simple ideas for validating blocks also don't work eg. the idea of *"A fresh block  must extend the most recent block we’ve seen. If we receive a fresh block, we accept it. Otherwise we reject it as unfresh"* will easily fail, creating blocktrees

    - *Blocktrees* - An adversary can still create split truth scenarios eg. from Fig.5.1 party-5 could hold a block (red) just enoguh time $t_A$ before a new party-6 broadcasts his (actually legitimate) next freshest block. Then if party-7 receives the red block (paty-5's) before party-6's block at $t_B$ (because $t_B-t_A=\Delta$, theres enough spacing to traverse the network) he would split the chain, and even worse yet reject party-6's block afterwards (Fig.5.2)
    
    <img src="../assets/learning/blockchain/ch052-blocktree.png" width="75%">
    
- We can use the *lenght of a chain* as a reference parameter because its correlated to the time it took to produce it
    - **Longest Chain Rule**. Among the all chains on the network adopt the longest chain (the one w/ most blocks) as the *canonical chain*. If there are multiple competing chains w/ the same length choose any chain arbitrarily
    - What we have now is a worse but will lead us in the right direction. Summarized, the steps that an honest party follows are: *1)* Maintain a local canonical chain $\mathcal{C}$. *(2)* keep mining on that chain. *(3)* if mining is successful, broadcast the new block and update the local canonical chain. *(4)* if not keep mining. *(5)* in the meantime check the length of any new incoming chain, if its longer then *reorg* and **roll back** blocks as needed
    - Lets introduce some notation, $B.\vec{x}$ is the sequence of transactions component of $B=s\|\vec{x}\|\text{ctr}$. We say that $B\in\mathcal{C}$ belonging to a particular chain history and the Ledger set is initialized as empty $[]$
- Recall the *read* functionality of a Ledger, we can now construct the basic algo (incomplete and naive until Chap.6 but workable)

```pseudo
\begin{algorithm}
\caption{The naive read rule}
\begin{algorithmic}
\Function{read}{$(\mathcal{C})$}
    \State $L\gets []$
    \For{$B\in\mathcal{C}$}
        \For{$\text{tx}\in B.\vec{x}$}
            \State $L\gets L\| \text{tx}$
        \EndFor
    \EndFor
    \Return $L$
\EndFunction
\end{algorithmic}
\end{algorithm}
```

## 5.3 The Stochastic Nature of Work
- Successful queries are a stochastic phenomenom. We've been dealing w/ probabilities like the expected time between two blocks $\eta=\frac{1}{f}=\frac{1}{nqp}$, which is a distribution of queries but shorter and longer spacing occurs $\Rightarrow$ causing a timing problem & *temporary forks* can happen even in the absence of $\mathcal{A}$. How bad is this?
    - The answer is not too bad because we can still rely on honest parties eventually converging to the correct longest chain. 
    - A fork can happen when the probability of two queries occurs at almost the same time, then some paries will mine on one chain and others will do the same on the other chain. If the subsequent block appended to each chain also occurs (almost) at the same time then the fork grows. 
    - However, probabilistically speaking, this cannot go on for long, at some point there will be $\Delta$ spacing between mined blocks in different chains and all honest parties will *roll back* & converge on the **longest chain**:
    - **Definition 19** (Convergence Opportunity (informal)). *An honest successful query is called a* **convergence opportunity** *if it is $\Delta$ spearated in time from all other honest successful queries*
    
## 5.4 The Honest Majority Assumption
- An adversary that has the majority of computing power in the network wrt to honest parties can cause a fork, and make her fork the longest chain making everyone else to adopt it. BUT if she has minority of mining power then her fork will always get outpaced by honest parties' chain
    - **Definition 20** (Honest Majority Assumption) *The* honest majority assumption *mandates that the adversary controls less compute than honest parties*: $t<n-t$

## 5.5 Coinbase Transactions
- Up to the last [[Learning/blockchain/05-chain.md#5.4-the-honest-majority-assumption|Sec.5.4]] we've constructed a decent financial system that supports P2P transactions yet we've said nothing about how (1) money is created & how supply is injected in the system (ie. via *coinbase transactions*) nor (2) what are the incentive mechanisms for parties to spend computing energy mining blocks
    - **(1) money supply through coinbase transactions** - In cypto we don't rely on trusting third parties to issue new supply so we must find a way to do this in code
        - Recall that all transactions must meet the conservation law introduced in [[Learning/blockchain/03-transactions.md#3.4-conservation-law|Sec.3.4]] except for *coinbase transactions*. We can make use of this by making all blocks to list a coinbase tx as its first element ie. $B.\vec{x}[0]=\text{coinbase-tx}$
    - **(2) mining incentives** - the pubKey of coinbase transactions can be freely chosen so naturally the miner can chose his own key as reward. Coinbase txs' value has two parts:
        - **(2.1) block reward $f_r$** - is new money injected into the system (minted out of thin air), $f_r$ must follow an algorithmic rule  aka *macroeconomic policy* from creation to max supply (stepwise, smooth curve, etc...)
        - **(2.2) transaction fees $f_f$** - fees that we charge for processing transactions

$$
\begin{align*}
f_t=f_r+f_f(B)=f_r + \sum_{\substack{\text{tx}\in B.\vec{x} \\ \text{tx non-coinbase}}} \left( \sum_{i\in\text{tx.ins }} i . v-\sum_{o\in\text{tx.outs}}o.v \right)
\end{align*}
$$

- The steps for coinbase validation are to check: *(i)* that it is the only one in $B$. *(ii)* its the first tx in the sequence $B.\vec{x}[0]$. *(iii)* it has no input & only one output. *(iv)* output value is $\leq f_t$. *(v)* check thet the coinbase is not spend in the same block ie. *coinbase maturation condition*
    - Maturation condition prevents the scenario where rewards can be confused as an attack. When the same miner wins two consecutive blocks & coinbase value $f_t$ is the same in both. To solve this we include the block height as metadata so that the two coinbase are distinguishable

## 5.6 Block Validation
- So far we've talked about how blocks are mined now we'll work towards an algorithm for validating them. Following simple steps: (1) Validate PoW. (2) Use $s$ to locate its parent block and (3) validate the sequence $\vec{x}$
    - To avoid spam, only valid blocks are gossiped. Validating a block implies validating transactions in $\vec{x}$. This is done by checking its parent block & outputs + outpoint for all txs in sequence.
    - This implicitely means checking state transitions from a previous block $\operatorname{st}(B_n)$ to the newest one being validated $\operatorname{st}(B_{n+1})$ & the intermediate state transitions within $B_{n+1}$ which are all $\text{txs}\in B_{n+1}.\vec{x}[1:]$ (excluding coinbase $\text{txs}$, which are typically indexed at zero)
    - State transitions are: $\operatorname{st}(B_n) \rightarrow \operatorname{st}(B_{n+1}.\vec{x}[1]) \rightarrow \ldots \rightarrow \operatorname{st}(B_{n+1}.\vec{x}[-1]) \rightarrow \operatorname{st}(B_{n+1})$
    - If any single state transition fails then the entire block is rejected!
    - Validating a chain means repeating the process just decribed recursively until the genesis block w/ state $\operatorname{st}(\mathcal{G})$

## 5.7 Maintaining the Mempool
- Nodes are constantly playing the mining game, in the meantime *unconfirmed transactions* arrive and get checked to then be placed in the limbo state aka **mepool state** which is the only parameter needed to describe how parties maintain their mempools: 
    - *Current node mines the next block* - This is the most trivial situation. Here the whole node's mempool becomes the new block & the full mempool gets emptied, so $\vec{x}_{n+1}=(\vec{x}_n)\setminus (B_{n+1}.\vec{x})=(\emptyset)$
    - *Another node mines the next block* - Assume that party $P_1$ has a chain $\mathcal{C}$ and party $P_2$ mines a new block $B_{n+1}$ on top of $\mathcal{C}[-1]=B_n$. The way we update $P_1$'s old mempool $\vec{x}_n$ to a future state is $\vec{x}_{n+1}$ is first by setting its chain state to the block's state $\operatorname{st}(\mathcal{C}[-1])\rightarrow\ldots\rightarrow\operatorname{st}(B_{n+1})$ and then compute the new mempool $\vec{x}_{n+1}$:
        - Apply each of the $\text{txs}\in\vec{x}_n$ in sequential-order against the current state $\operatorname{st}(B_{n+1})$ ie. compare a `diff` between $\vec{x}_n$ against $B_{n+1}.\vec{x}$ (something similar to a set difference $\vec{x}_{n+1} = (\vec{x}_n) \setminus (B_{n+1}.\vec{x})$ but these are ordered sequences). The non-conflicting leftover $\text{txs}\in\vec{x}_n$ become $\vec{x}_{n+1}$
        - conflicting $\text{txs}\in\vec{x}_n$ get thrown away and don't make it to $\vec{x}_{n+1}$, because $\text{txs}\in B_{n+1}.\vec{x}$ get precedence
    - *chain reorgs*: Say one party was mining on chain $\mathcal{C}^\prime=(B,B_1^\prime,B_2^\prime)$ and computed a mempool $\vec{x}_{n+1}^\prime$ on $\mathcal{C}^\prime$ but then downloads a new longest chain $\mathcal{C}=(B,B_1,B_2,B_3)$ so a **reorg** occurs & we want to compute the new mempool $\vec{x}_{n+1}$ on the correct chain $\mathcal{C}$
        - our chain $\mathcal{C}^\prime$ must **rollback** to the latest common ancestor $B$, so undo the state transitions $\operatorname{st}(B_2^\prime)\rightarrow\operatorname{st}(B_1^\prime)\rightarrow\operatorname{B}$ and then pick up on the longest chain $\mathcal{C}$ so perform $\operatorname{st}(B)\rightarrow\operatorname{st}(B_1)\rightarrow\operatorname{st}(B_2)\rightarrow\operatorname{st}(B_3)$
        - To compute the new mempool $\vec{x}_{n+1}$ we must consider that not all $\text{txs}\in B_1^\prime.\vec{x}\cup B_2^\prime.\vec{x}\cup \vec{x}^\prime_{n+1}$ are disposable & some can go to the newest mempool. Thus, we set the state of $\vec{x}_{n+1}$ to $\operatorname{st}(B_3)$ then we trial $\text{txs}\in B_1^\prime.\vec{x}$ against it, then we trial $\text{txs}\in B_2^\prime.\vec{x}$ and lastly we trial $\text{txs}\in \vec{x}_{n+1}^\prime$
        - Only unapplicable and conflicting transactions are thrown away
