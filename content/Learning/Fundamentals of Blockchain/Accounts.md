---
title: 7. Accounts
date: 2024-11-29
---

- We can simplify describing a blockchain as a distributed system which runs a decentralized protocol that securely stores an append-only Ledger. This leads to defining machinery for updating the Ledger called **State Machine Replication** and relies on *states & state transitions* (a *state* is a configuration at a particular time and a transaction $\text{tx}$ enables *state transitions*)
    - The way that the UTXO model performs this is by removing outpoints (old state) corresponding to inputs from an incoming $\text{tx}$ (state transition) and updating outputs (new state)
    - Some of the machinery used to achieve *consensus* is dependent on the UTXO model (ie. validation aspects concern the **consensus layer**) but some others are independent of the computing model (ie. transaction design & semantics). Thus other Blockchains are based on a different computing paradigm designs that also offer state transitions ie **Accounting Model**

## 7.1 Accounts Model
### 7.1.1 Accounts Model Compared to UTXO Model
- Lets compare the state transition mechainsm in each blockchain design:
- The transaction validation process in the UTXO model goes like *(i)* check $\sigma$, *(ii)* check conservation law, *(iii)* check inputs $\text{tx}_\text{in}$ are in current $\operatorname{st}$ (UTXO set state). The state transition function $\delta(\operatorname{st}, \text{tx})$ has the following cases

$$
\begin{equation}
\delta_{\text{UTXO}}(\operatorname{st}, \text{tx}) = 
\begin{cases}
\operatorname{st} \setminus \text{tx}_\text{in} \cup \text{tx}_\text{out} & 
\begin{array}{l}
\text{if tx valid wrt. }\operatorname{st} \\
\end{array} \\ \\
\perp & 
\begin{array}{l}
\text{otherwise}
\end{array}
\end{cases}
\end{equation}
$$

- In the Accout model the transaction validation process goes as *(i)* check $\sigma$, *(ii)* check $\operatorname{st}[\text{tx.from}]\geq \text{tx.value}$:

$$
\begin{equation}
\delta_{\text{acc}}(\operatorname{st}, \text{tx}) = 
\begin{cases}
\operatorname{st}^{\prime} & 
\begin{array}{l}
\text{where, }\operatorname{st}^{\prime}[\text{tx.from}] = \operatorname{st}[\text{tx.from}] - \text{tx.value}, \\
\operatorname{st}^{\prime}[\text{tx.to}] = \operatorname{st}[\text{tx.to}] + \text{tx.value}\text{, if tx valid wrt. }\operatorname{st} \\
\end{array} \\ \\
\perp & 
\begin{array}{l}
\text{otherwise}
\end{array}
\end{cases}
\end{equation}
$$

## 7.1.2 Accounts Model Replay Attack
- The basic design of an account opens the door for attackers to replay a transaction even if it wasn't invoked by the rightfull owner of a particular account because the naive transacion structure only includes $\text{From, To, Value, }\sigma$ so transactions are NOT unique
    - *Replay Attack* - If we don't add a **nonce** (a $256$-bit integer) to the Account model then an attacker can take advantage of re-submitting transactions w/o a unique label identifier
- A side by side comparison is shown below in Fig.9.7

<img src="../assets/learning/blockchain/ch091-utxo-account-comparisson.png" width="75%">

## 7.2 State Machine Replication (SMR)
- Since blockchains are a distributed replicated database, where each node has its own copy and applies database updates via local state machine transitions. The goal of SMR is that each node runs the same set of state transitions accross the network & in the same order so that there is consensus on the global state machine

## 7.3 Light Clients
- Full nodes store all the data of the blockchain (currently measured in many GBs and potentially TBs in future years) but this is inefficient for smaler compute-resourceful devices
    - Thus, we can offer a **light client** version of a node, that still participates in the network but has less *storage, communication & computation* load

### 7.3.1 Storage Efficiency: Merkle Trees
- Our light clients are required to operate w/ less workload, so they cannot store all data. It is better for them to store hashes that correspont to data files stored at a server somewhere else
    - When retrieving that data we download the file and checksum its hash to ensure validity. 
    - *Trade-off:* **Communication complexity vs storage complexity** - Decrease storage load (store one hash per entire file) but increase communication complexity (deal w/ seeking for a specific piece of info from the entire file). Or decrease communication complexity (efficiently retrieve only the chunk of info needed from the entire file) at the expense of increseased storage (light client has to store more hashes per chunk)
- *Merkle trees* achieve the ideal case of logarithmic-proof size communication complexity $\mathcal{O}(\log{n})$ and constant storage $\mathcal{O}(1)$

### 7.3.2 Data Structure: Merkle Tree (MT)
- We chop a file $D$ into $n$ (pair number) chunks: $D[0],D[1],\ldots,D[n-1]$
- A *bianary tree* of depth $\mu$ has $2^\mu=n$ leaves and each node in the binary tree stores the hash $h$ of its two hashed-children concatenated $h := H \left( h[\text{left}]\| h[\text{right}] \right)$
- The process of retrieving data involves retrieving the desired data chunk eg. $D[j]$ (sitting at a leaf) & all the necessary node-hashes $\pi_0, \pi_1, \pi_2, \pi_3$ ie. sibling hashes along the path to the root root-hash $h_\epsilon$ (bottom-up) 
- See Fig.9.8. Note that $\pi$-values are sibling-hashes that need to be retreived whereas $e$-values are values that we CAN compute. Verification goes as follows:
    - *(i)* compute the hash of the data chunk $e_0=H(D[j])$. *(ii)* hash all pairs climbing up the tree so either $e_k=H(e_{k-1}\| \pi_{k-1})$ or $e_k=H(\pi_{k-1}\| e_{k-1})$. *(iii)* until we get to the *Merkle-tree root* $e_{\mu+1}=h_\epsilon$
    - With the MT data structure as our storage algo we get to transfer data as: a list of $\pi$ values and the data chunk of fixed size. Which gives $|\pi|=\mathcal{O}(\log{n})$ efficient communication and $\mathcal{O}(1)$ constant storage!
- The MT structure is described by the functions:
    - $\operatorname{compress}(D)\rightarrow h_\epsilon$,
    - $\operatorname{prove}(D, j)\rightarrow\pi$, and
    - which are used to check MT correctness:
        - $\forall D, \forall j,\;\operatorname{verify}(h_\epsilon, D[j], j, \pi)\begin{cases}\text{true, if valid} \\ \text{false, otherwise}\end{cases}$
    
<img src="../assets/learning/blockchain/ch0932-merkle-tree.png" width="90%">

### 7.3.3 Security of Merkle Trees
- MT-security means that if the client outputs $\operatorname{verify}(h_\epsilon, d=D[j], j, \pi)=\text{true}$ after verifying the received data chunk $D[j]$ and proof, then the received data $d$ must be the same data $D$ that was originally stored
- Hypothetically, an $\mathcal{A}$ that could break Merkle trees would win algo 15, achieving $\operatorname{verify}=\text{true}$ while corrupting the data to be retrieved $d\neq D[j]$ 
- **Theorem 9**. *Let $H$ be a collision resistant hash function. Then Merkle trees constructed with $H$ are MT-secure*
    - *Intuitive soft proof* - ultimately it finishes with:
    - Therefore the prob of breaking Merkle tree protocol is the same as the prob of breaking the collision-resistant function $H$ (ie. a negligible function): $\forall \text{PPT }\mathcal{A}: P[\operatorname{MERKLE}_{\mathcal{A}}(\kappa)=1]=P[\operatorname{collision}_\mathcal{A}(\kappa)=1]\leq \operatorname{negl}(\kappa)$

```pseudo
\begin{algorithm}
\caption{Breaking the Merkle tree game}
\begin{algorithmic}
\Function{merkle}{$\kappa$}
    \State $D,\pi ,j,d \gets \mathcal{A}(1^\kappa)$
    \Return $\text{verify}(\text{compress}(D),d,j,\pi) \wedge d\neq D[j]$
\EndFunction
\end{algorithmic}
\end{algorithm}
```
