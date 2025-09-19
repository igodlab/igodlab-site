---
title: 6. Chain virtues
date: 2024-11-13
---

## 6.1 Transactions - Blocks
- Some attributes that differentiate and give security to different components are summarized in Table.6.1

<img src="../assets/learning/blockchain/ch061-txs-blocks.png" width="75%">

## 6.2 Safety, Revisited
- So far we've built a protocol that is safe against *collision attacks, forgery, double spending txs, witholding blocks & adversary forks*. But we can spot another vulnerability in the *read query* functionality of a Ledger - nodes/parties $P_1,P_2$ may not report the exact Ledger version at all times. We'll demand more safety propositions we want to accopmlish 
- We'd like both Ledgers to be exactly the same, so they should report the same element/$\text{tx}$ at position $i$ at time $r_1$: $L_{r_1}^{P_1}[i]=L_{r_1}^{P_2}[i]$, this may fail due to either of the two scenarios below: 
    - *(1) Ledger read query when broadcasting hasn't traversed the whole network yet* - $P_1,P_2$ will report different Ledgers if either one is still catching up to update the latest block while its traversing the network (within $\Delta$ time)
        - **Definition 21** (Ledger Safety). *A protocol is safe if it holds that for any two parties $P_1,P_2$ and any two times $r_1,r_2$, it holds that either $L_{r_1}^{P_1}\preccurlyeq L_{r_2}^{P_2}\vee L_{r_2}^{P_2}\preccurlyeq L_{r_1}^{P_1}$*
            - where notation $A\preccurlyeq B$ for the finite sequences $A,B$ means that $B[:|A|]=A$ ie. one equence is contained within the other one, exactly to every element
        - **Lemma 5** (Safe $\Rightarrow$ No double spend (informal)) *In a safe protocol that ensures transaction validity locally, two honest parties can never confirm two colficting transactions*
    - *(2) Ledger read query when parties are in different forks* - if at some point in time $P_1$ is mining on the longest chain and $P_2$ on a temporary fork, they'll report different Ledgers

## 6.3 Honest Convergence
- Short-lived forks occur all the time and we can rely on the *longest chain rule* for resolution, which is guaranteed to happen because of the probability of many consecutive blocks appended on each fork, each within $\Delta$, (ie. when the network mining power is split) decays quickly
    - Forks can only survive as long as split nodes keep mining blocks in parallel & within $\Delta$, since this is unlikely to go on for long we can expect (Fig.6.3):
    - **Lemma 6** (Honest Convergence (HC)) . *In a setting where only honest parties are mining, exactly $\Delta$ time after every convergence opportunity, all honest parties will hold the same chain*
- **Trade-off**: *blockchain performance & security* - An example of parameterizing the network for perfomance is finding the sweet spot for optimizing *honest convergence opportunities* w/o sacrificing block produciton rate (see Fig.6.4)
    - While every successful PoW query is an HC opportunity, at low *block-production rate* $f=npq$, queries are so rare that HC is rare as well. Whereas at high $f$ we have more forked competing queries & we don't allow the network to have sufficient time to resolve forks
    
<img src="../assets/learning/blockchain/ch063-honest-convergence.png" width="75%">
<img src="../assets/learning/blockchain/ch063-density-convergence-opportunity.png" width="75%">

## 6.4 Common Prefix
- We've stated that forks are temporary and short-lived, but how short? Looping back to the problem of invoking the *read-query* functionality of the Ledger how short should we consider forks to be to then make Ledgers report a chopped chain
    - **Common Prefix Virtue** - lets introduce another parameter $k\in\mathbb{N}$, which intends to capture the longest number of blocks possible in all forks. This allows us to decide how many blocks we can ommit (hide or chopp-off) while reporting a read of the Ledger
    - **Definition 22** (Common Prefix). *A system is said to satisfy* Common Prefix *with parameter $k\in\mathbb{N}$ if for all honset parties $P_1,P_2$, and for all times $r_1\leq r_2$, the chains adopted by the honest parties satisfy the property that:* $C_{r_1}^{P_1}[:-k]\preccurlyeq C_{r_2}^{P_2}$
    - **Theorem 7** (Common Prefix $\Rightarrow$ Safety (informal)). *If the blocktree satisfies Common Prefix with parameter $k$, then the longest chain protocol with the $k$-confirmation rule is safe* 
        - *$k$ is another tunable parameter* - If we chose a small $k$, then *liveness* is high but we risk violating Common Prefix & thus risking safety. If we choose a large $k$ then we are certain that we'll never have conflicts with Ledger versions at the expense of hurting *liveness*
- We can update algo 12 from [[learning/blockchain/05-chain.md#5.2-the-arrow-of-time|Sec.5.2]] to read a chain with Common Prefix

```pseudo
\begin{algorithm}
\caption{The stable read rule}
\begin{algorithmic}
\Function{read}{$\mathcal{C}$}
    \State $L\gets []$
    \For{$B\in\mathcal{C}[:-k]$}
        \For{$\text{tx}\in B.\vec{x}$}
            \State $L\gets L\| \text{tx}$
        \EndFor
    \EndFor
    \Return $L$
\EndFunction
\end{algorithmic}
\end{algorithm}
```

> [!note] info
> 
> Up to this point our construction of a cryptocurrency is COMPLETE! The rest of the notes augment protocol construction while maintaining security.
    
## 6.5 The Nakamoto Race
- As we've stated in our blue note above, our protocol can be secure as it is now w/o the need of introducing new params BUT contingent to tunning the existing ones properly. Having said that we are not free from attacks
    - **Nakamoto Race** - refers to parties 'racing' for the longest chain, where split nodes move in discrete steps (steps are blocks). The frequency of successful PoW queries translates in the speed at which they can move along one 'racing lane' or fork
    - *Honest Convergence is not enough!* - $\mathcal{A}$ can opt for another attack vector ie. $\mathcal{A}$ can target our $k$*-confirmation-protocol*. If she mines in secret and manages to get $k+1$ blocks long on her fork, then its over, she can overtake the longest chain. Lets describe the feasibility of this playing out
        - *(1) Honest Majority Assumption MUST hold* - If the adversary gets control of the majority of the nodes in the network ($t>n-t$) then it is impossible that honest parties can win the *Nakamoto Race* 
        - *(2)* **Fan-out:** *$\mathcal{A}$ can coordinate to use all her speed in one racing lane* - (Fig.6.8) If honest majority assumption holds, we are guaranteed to have higher density of honest successful queries $X$. However, this is doesnt guarnatee that they can win the *Nakamoto Race* because their queries could be split in honest forks. So what actually matters is comparing **honest convergence** opportunities $Y$ against **$\mathcal{A}$ successful queries** $Z$
        - *In our analogy* - honest nodes have more speed capacity $X$ but it is allocated in different racing lanes / forks, and effectively none of them $Y$ moves faster than $\mathcal{A}$ (who uses all her speed capacity $Z$ in a coordinated fashion)
    
<img src="../assets/learning/blockchain/ch065-nakamoto-race.png" width="75%">
    
## 6.6 The Fan Out
- Fan-out is when situation (2) plays out in [[learning/blockchain/06-chain-virtues.md#6.5-the-nakamoto-race|Sec.6.5]]. Despite honest nodes having larger mining power (which translates into more speed capacity) it is allocated in a non-coordinated way, contributing to fragmented speed accross many 'racing lanes' / honest forks. Whereas $\mathcal{A}$ is a pueptmaster who can control all her minions to allocate all mining power on the corrupted fork and, w/ less combined mining power, can still BEAT the honest nodes in the *Nakamoto Race*

## 6.7 Chain Quality & Chain Growth
- In summary **chain virtues** give rise to **Ledger virtues**. *Safety* follows from Common Prefix and *liveness* follows from Chain Growth & Chain Quality, lets define these last two:
    - **Definition 23** (Chain Velocity aka Chain Growth). *Consider an honest party and his local chains $C_1,C_2$ at times $r_1<r_2$ respectively. We say that the chain has grown with a velocity $\tau=\frac{|C_2| - |C_1|}{|C_{r_2}| - |C_{r_1}|}$, where $C_{r_1},C_{r_2}$ are the global chain snapshots at those respective times*
        - to maintain good *liveness* we want our chain to sustain a minimum velocity $\tau$. However, this side of the argument is not enough, because we can have good chain growth but w/ corrupted blocks, we also need to define:
    - **Definition 24** (Chain Quality). *Consider that the chunk $C[i:j]$ of an honest party's adopted chain $\mathcal{C}$. We say that the chunk has chain quality $\mu=\frac{z}{|C[i:j]|}$*, where $z$ is the number of honest blocks in $\mathcal{C}[i:j]$
    - **Theorem 8** (Chain Growth $\Rightarrow$ Liveness (informal)). *If the blocktree satisfies Chain Growth and Chain Quality with positive params $\tau>0$ and $\mu>0$ respectively, then the longest chain protocol is __live__*

## 6.8 Further Reading
- The two chain virtues of Common Prefix & Chain Quality were first introduced in the *Bitcoin Backbone paper* @nakamoto2008bitcoin
- The Chain Growth virtue was identified in a later paper: *Speed-Security Tradeoffs in Blockchain Protocols* @kiayias2015speed 
- The Ledger virtues of *liveness* and *safety* have been adapted from older literature @lamport1982byzantine in the context of two problems: (1) The Byzantine Generals Problem and (2) The Byzantine Agreement Problem

# References
