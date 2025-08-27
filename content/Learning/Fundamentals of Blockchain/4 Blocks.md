# Blocks

### 4.1 The Network Delay
- Let's recap the core concepts up to Chapter 3, we have:
    - Created a monetary system that allows participants to transfer money between one another
    - Ensured that participants can ony spend their own money by using an *unforgeable crypto signature scheme* to authenticate transactions
    - Enabled that participants can determine *who owns what* via gossiping transactions through the network, upon verification, into a *transaction graph* & reading the *UTXO set*. Note that the latter is the only thing that determines who owns what whereas the former just stores the history of past value transfer
- Our assumption is that since every transaction is gossiped everyone will eventually arrive at the same transaction graph and reach consensus on the UTXO set
    - The order at which transactions arrive wrt some honest node doesn't matter as long as they are gossiped within some time $\Delta$ (except for the double spending problem)
    - **Definition 13** (Network delay). *The network delay parameter $\Delta$ measures the maximum time it takes for a message to travel from one honest party to every other one on the network*
    - Gossiping ensures that even adversarial messages make it accross the network within $\Delta$, thus can be caught

### 4.2 Double Spending
- In a nutshell it is when two transactions $\text{tx}_2,\text{tx}_2^\prime$ consume the same legitimate output from previous $\text{tx}_1$ and the gossiping of $\text{tx}_2,\text{tx}_2^\prime$ occurs in different order for different honest nodes. Causing a split truth scenario:
    - some honest nodes accept $\text{tx}_2$ because it came first, these nodes removed the output from $\text{tx}_1$ from their UTXO set then updated it with the new unspent outputs from $\text{tx}_2$ and then rejected $\text{tx}_2^\prime$ because it came by second trying to spend outputs that are not there anymore BUT the reverse scenario plays out for other nodes - accepting $\text{tx}_2^\prime$ and taking its outputs as their latest UTXO set version and rejecting $\text{tx}_2$
    - This is bad because there is no consensus on the same UTXO set so we've lost agreement on *who owns what*

### 4.3 Simple Ideas Don't Work
- We'll list some simple ideas that come natural to solve double spending and then dismantle them one by one:
    - *Idea 1*.- Reject double spends altogether $\rightarrow$ doesn't work because $\mathcal{A}$ now only as to withold $\text{tx}_2^\prime$ for a bit (see Fig.4.2)
    - *Idea 2*.- Accept the first transaction seen $\rightarrow$ makes it easy for $\mathcal{A}$ to provoke split truth, she just has to spam Charlie and David with $\text{tx}_2, \text{tx}_2^\prime$ in different order (see Fig.4.3)
    - *Idea 3*.- Reject double spends within time $u\geq\Delta$, after $u$ accept first transaction seen $\rightarrow$ still easy for $\mathcal{A}$ to break consensus, she just has to spam Charlie with $\text{tx}_2^\prime$ within $u$ and $\Delta$ and spam Dave with $\text{tx}_2^\prime$ after $u$ but within $\Delta$, the former rejects both double spends & the latter just takes $\text{tx}_2$  as it came first
- The double spending problem is not trivial so we'll spend the next many sections accumulating weapons to tackle it

<img src="images/ch043-simple-ideas.png" width="85%">

### 4.4 Ledgers
- Since honest parties receive transactions in different order we can demand them to construct & report a **Ledger** which orders transactions sequentially
    - If reading a reported Ledger by some honest party that allows the reconstruction of the transaction graph we can land to the latest UTXO set and if other honest parties agree on the reported Ledger $\Rightarrow$ we've recovered consensus on *who owns what* against double spending
- To construct a Ledger we'll need a more sophisticated system, including more elements: 
    - *(i) The Full Node*: a piece of code identically executed by all honest parties and is in charge of **peer discovery** & **gossiping** messages. Moreover, it exposes two functionalities *read* & *write* which returns the Ledger of transactions & accepts, broadcasts and gossips new transactions, respectively
    - *(ii) The Wallet*: is the intermediary element between a human user and the full node, it can invoke *read* & *write* functionalities from the full node
    
<img src="images/ch044-ledgers.png" width="60%">

- The following definitinos are ideals (but poses a dilemma):
    - **Definition 14** (Ledger). *A ledger of an honest party $P$ reported at time $r$, denoted $L^P_r$ is a finite sequence of transactions returned wen the honest party $P$ invokes the read functionality of its honest protocol $\Pi$*
        - *note.-* that we must speak in terms of a Ledger version reported by who? (according to $P$) at some time $r$
    - **Definition 15** (Safety (informal)). *For any two honest parties, their reported Ledgers at any point in time are equal*
    - **Definition 16** (Liveness (informal)). *In an honest party writes a transaction into its Ledger, then this transaction appears in the Ledgers of all honest parties "soon"*
- Its easy to build a protocol that has *safety* or *liveness* but NOT both together:
    - Lets imagine we want to max safety (*safe but not live* protocol), we can disable/ignore the *read/write* functionalities, then we guarantee that all parties will always report the same empty Ledger at any point in time. We maxed safety at the expense of liveness
    - If we max liveness (*live but not safe protocol*) we'll have the *write* functionality immediately appending a transaction in the local Ledger of some $P$ party and any incoming gossiped-transaction is also appended into the local Ledger. When the *read* functionality is invoked the local Ledeger is returned. We maxed liveness at the expense of safety because not all Ledgers will have the same order of transactions (since local ledgers immediately append transactions)
    - **Definition 17** (Security). *A protocol $\Pi$ is secure if it produces Ledgers that are both safe and live (balanced trafe-off)*

### 4.5 Rare Events
- To combat double spending we can introduce a rare-event parameter in the protocol: granting a ticket that acts as a knob to tune security on who can issue a transaction to the network & at which frequency
    - if we enforce participants to get a ticket at least every $\Delta$ time appart $\Rightarrow$ we guarantee that $\mathcal{A}$ cannot spam with sequential transactions in shorter times than $\Delta$
    - the notion of issuing tickets is: if these are issued far spread appart ($\gg \Delta$) we guarantee safety but deteriorate liveness; if issued at $<\Delta$ safety is in risk because if double spending; if issued slightly more than $\Delta$ we can get good liveness and safety

### 4.6 Proof-of-Work
- A system to issue tickets with *tunable frequency* that grant autorization to send transactions to full nodes can be based on many different ideas
    - **Proof of Work (PoW)** - is Bitcoin's mechanism to accomplish this. Inspired in algo 4 from chapter 2 (brute force exponential `preimage-search`), but modified to make it slighty easier:
        - Recall that finding a preimage means finding $B$ from a $\kappa$-bit long hash $H(B)=h$
        - We choose to accept any value of $B$ that hashes *close enough* to its original unique hash $h=0$, this is defined by the *target* value $T$: $H(B)\leq T$ (aka **mining** for satisfying the **PoW inequality**)
        - Thus by modifying the *difficulty* $1/T$ (how hard it is to brute-force-guess the PoW inequality) we can tune the frequency at which our system grants tickets
            - Large $T$ makes tickets highly frequent, small $T$ spaces tickets further appart. At $T=2^\kappa$ we make proof-of-work trivial because any value $B$ satisfies $H(B)\leq 2^\kappa$, whereas at $T=0$ we make proof-of-work the same as finding a preimage (impossible & needs EXPONENTIAL TIME) 

<div style="background-color:rgb(181, 191, 226); padding:10px 0;font-family:monospace; font-family:monospace">
<font color = "gray"># <strong>Algorithm 4</strong> An exponential search for a preimage that <i>certainly</i> finds the preimage</font><br>
<strong>function</strong> preimage-search$_{H}(h)$<br>
&nbsp;&nbsp;ctr $\leftarrow 0$<br>
&nbsp;&nbsp;<strong>while</strong> true <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>if</strong> $H($ctr$)=h$ <strong>then</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>return</strong> ctr<br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>end if</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;ctr $\leftarrow$ ctr $+ 1$<br>
&nbsp;&nbsp;<strong>end while</strong><br>
<strong>end function</strong>
<br>
<br>
<font color = "gray"># <strong>Algorithm 10</strong> PoW algorithm (Proof-of-Work)</font><br>
<strong>function</strong> $\operatorname{PoW}_{H,T}$<br>
&nbsp;&nbsp;ctr $\leftarrow^\$ \{0,1\}^\kappa$<br>
&nbsp;&nbsp;<strong>while</strong> true <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$B\leftarrow$ ctr<br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>if</strong> $H(B)\leq T$ <strong>then</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>return</strong> $B$<br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>end if</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;ctr $\leftarrow$ ctr $+ 1$<br>
&nbsp;&nbsp;<strong>end while</strong><br>
<strong>end function</strong>
</div>

### 4.7 The Block
- We've removed the double spending problem demanding winning proof-of-work to get a ticket (at a max frequency of $\Delta$). We can now establish the relationship of tickets wrt issuing transactions, what does winning a ticket allow a participant to do?
    - *Tie one ticket to one transaction* - If we tie our random $\text{ctr}$ num and the transaction id, then the hash of $B=\text{txid} \| \text{ctr}$ ($\|$ means concatenation) is committing to a particular transaction and ensures that $\mathcal{A}$ cannot trick the system by attempting to issue a (corrupted) transaction other than the one she committed to, otherwise she will waste energy playing the incorrect guessing game searching for the wrong hash inequality
    - *Tie one ticket to a payload* - The previous point deteriorates *liveness*, to improve this we can bundle a sequence of transactions into a **block payload** $\vec{x}=(\text{tx}_1\ldots,\text{tx}_n)$ and then tie $B=\vec{x}\| \text{ctr}$ to the ticket aka **block**
    - *Double spending in the bundle?* - One might think that when bundling transactions the double spending problem resurfaces (again we allow more than one transaction to occur within $\Delta$). However, inside a block payload we have full view of each transaction's outpoints thus we can use our *simple ideas* (from Sec.4.3) to prevent double spending
    - *Tickets ensure that block payloads are spread $\Delta$ appart* - Double spend attempts can occur in different blocks of the network but still are $\Delta$ appart (plus other custom protocol security designs)

### 4.8 The Mempool
- The solution to double spending - mining blocks, comes with one main problem: we tie the liveness to a particular honest party's coputational power. This creates a race to get a ticket where large computational power gets the advantage, magnifying the computational power imbalance among honest parties. 
- In the less optimistic case at least we'd like to design our system such that it doesn't favor this diparity. So we introduce the concept of the **mempool** (sort of a waiting room for transactions before being bundled into a block)
    - **Definition 18** (Mempool). *The mempool $\vec{x}$ of an honest party $P$ at a time $r$ is the sequence of transactions that have been received and validated, but have not yet been included in a block*
    - *Gossiping & validating transactions* - First, transactions traverse the network and get validated, here we run a 1st safety check against double spending (using our *simple ideas* Sec.4.3). Our system now allows any participant to issue transactions w/o fear of double spending because these accumulate in the mempool & get through safety checks
    - *Transactions are ordered in the mempool* - Every honest party builts his own mempool with, ideally the same sequence of transactions. However, since $\mathcal{A}$ is present this is not the case but its also no problem because transactions, in the process of accumulating in the mempool, get ordered and removed if problematic. 
    - *Confirmed transactions* - After the mining game winner goes on to assemble a block with all the transactions in his mempool (where the second check aginst double spending occurs, checking for conflicting outpoints) we refer to these transactions as *confirmed*. 
- Note that with the mempool, liveness is not severely affected becasue all inflow of transactions will eventually be confirmed by the PoW honest party winner, and this occurs every $\Delta$ which also ensures we're safe against double spending
- Moreover, when wallets ask for the *read* functionality ONLY confirmed transactions are reported in the transaction DAG + UTXO set

### 4.9 Chain of Blocks
- While PoW ensures that $\mathcal{A}$ gets a block in spaced out time intervals. She may take advantage of a couple of *stale blocks*, witholding them to then issue them in close $\Delta$ succession.
    - We can solve this easily by enforcing some notion of *freshness* in blocks ie. requiring only freshly packaged blocks to be issued $B=s\|\vec{x}\|\text{ctr}$ so we include the pointer to the previous blockid $s$
    - Similar to transactions a block $B$ also has a unique identifier: *blockid* $H(B)$ which typically is a convolution of hashes of its contents
        - In PoW, blockids are small (many initial $0$s) because they satisfy the PoW inequality
- The **blockchain** is a chain-of-blocks which are discrete and sequential in time where the newer one points to the previous blockid aka *previd*

<div style="background-color:rgb(181, 191, 226); padding:10px 0;font-family:monospace; font-family:monospace">
<font color = "gray"># <strong>Algorithm 10</strong> PoW mining algorithm associated with multiple tranasctions $\vec{x}$ and previous blockid $s$</font><br>
<strong>function</strong> $\operatorname{PoW}_{H,T}(s,\vec{x})$<br>
&nbsp;&nbsp;ctr $\leftarrow^\$ \{0,1\}^\kappa$<br>
&nbsp;&nbsp;<strong>while</strong> true <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$B\leftarrow s \| \vec{x} \| $ctr<br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>if</strong> $H(B)\leq T$ <strong>then</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>return</strong> $B$<br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>end if</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;ctr $\leftarrow$ ctr $+ 1$<br>
&nbsp;&nbsp;<strong>end while</strong><br>
<strong>end function</strong>
</div>

### 4.10 Genesis
- In the previous section we made blocks attest about their freshness by pointing to the *previd*. But what about with the first *genesis block*? It cannot point to anything before it
    - $\mathcal{A}$ might take advantage of this by anticipating in (secretely) producing blocks before the protocol actually launched (*premining* attacks)
    - To prevent these type of attacks the genesis block must contain in its metadata an anchor to unpredictable timestamped events (such as the frontpage of the next day newspaper eg. Bitcoin's The Times 03/Jan/2009 Chancellor on brink of second bailout for banks)
    - This anchor come into play conditioning the first PoW inequality, thus, only the protocol developer(s) can ensure which is the genesis block
    
### 4.11 Mining
- The basic operational state that miners are stuck into (at least in first gen blockchains like Bitcoin) is the following, miners are constantly:
    - Maintaining a consistent local mempool $\vec{x}$ of transactions
    - Attempt to mine a block $B=s\|\vec{x}\|\text{ctr}$ by findning $\text{ctr}$ that satisfies $H(B)\leq T$
    - If mining is successful, broadcast the newly created block $B$
    - Otherwise, keep mining
- Here we note Bitcoin's PoW inefficiency, because miners are constantly spending energy solving the PoW puzzle even if they're not going to win, also they're spending energy even if their mempool is empty (they'd issue empty blocks)
