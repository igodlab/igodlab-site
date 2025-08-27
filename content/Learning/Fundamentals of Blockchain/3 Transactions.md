# The Transaction

### 3.1 Coins
- Now that we have covered the basics - money is a social construct and we agreed on our ctypto primitives $\rightarrow$ we can create our own money:
    - As long as it is difficult to forge and everyone agrees on *who owns what*
- We'll refer to transactions as coins passing from hand-to-hand
    - Transactions are boxes were transitions occur and arrows represent value moving ie. returning/changing owner
    - Illustrations put names on owners but in reality these are pub-key hashes not legal identities

### 3.2 Multiple outputs
- Dangling arrows are **Unspent Transaction Outputs (UTXOs)** any other arrow that points to a transaction block is already spent
- Similarly to the cash system, if one has a 1000 bill and wants to spend only 50 to buy a book but keep the other 950, then they must split the physical bill into 50 bucks + change. *UTXO*s function in the same way


### 3.3 Multiple inputs
- Multiple inputs can converge into a transaction block to aggregate for making larger payments

### 3.4 Conservation law
- With the exception of minting new tokens (which have a genesis where everything gets created in one transtaction) all other transactions must obey a *conservation law*:
    - value comming from all inputs must equal the value comming from all outputs (minus a tx fee): 
    - **Definition 11** (Conservation law). *Given a transaction $\text{tx}$, we say that it obeys the Conservation Law if*: $\sum_{\text{in}\in\text{tx.ins}}\text{in.v}=\sum_{\text{out}\in\text{tx.outs}}\text{out.v}+\text{fees}$
    
### 3.5 Outpoints
- All transactions have a unique identifier $\text{txid}$, obtained by hashing all of its transaction data ie. I/Os
    - All inputs are just outputs being spent, thus we can reference ouputs with a tuple containing $(\text{txid}, \text{idx})$ ie. from which previous transaction block $\text{txid}$ does its input number $\text{idx}$ come from?
    
### 3.6 The UTXO Set
- The whole history of payments forms a transaction **(DAG) Directed Acyclic Graph** (an append-only graph)
    - The diagram is simplified for conciseness (not showing owners or values)
    - Key thing is to highlight that UTXOs are the current state of the Ledger, all UTXO's form the **UTXO set** in the Ledger at a particular time
    - When a payment occurs a party creates a new transaction and broadcasts it to the network
    - Each node in the network appends new transtactions and stores the whole transaction graph ie. everyone knows *who owns what* by looking at their local UTXO set
    - To know *how much* a particular party has, he must collect and sum the value of all of the UTXOs (from the current UTXO set) marked with a pub-key whose respective private-key is in his possesion 

<img src="images/ch036-dag-utxo-set.png" width="60%">


### 3.7 Transaction signatures
- For a transaction to be valid, its inputs must point to outputs whose spending has been authorized by their rightful owner. 
    - This can be done by signing the new transaction data using the secret key that corresponds to the public key annotated on the previous output being spent.
    - Upon creation, a transaction must have each of its inputs $\text{in}_1,\ldots,\text{in}_n$ signed by his owner's private-keys $\sigma_1, \ldots, \sigma_n$ (created by $sk_1,\ldots,sk_n$ and verifiable by $pk_1,\ldots,pk_n$), respectively
    
### 3.8 Transaction creation
- The general chronological order to create a new transaction is: *(i)* sender request the receiver his pub key through some off-chain means. *(ii)* sender picks his UTXO outpoints to spend from then signs everything ($\sigma=sk+pk$ for each) and creates a new transaction with the outputs containing receiver's pub key and value being trasferred. *(iii)* collects all data in previous step into a message. *(iv)* for each UTXO outpoint sender signs with private key and *(v)* broadcasts the transaction to the network.

### 3.9 Transaction format
- A concrete example of a transaction block (shown below) is a collection of 
    - 1. List of inputs $(\text{txid, idx})$ - each element is an outpoint: tuple of an existing UTXO hash $\text{txid}$ and its output number $\text{idx}$
    - 2. List of outputs- each element is a pair of pub key (receiver/owner of the output) and value amount (integer w/ comma shifted to avoid floating point operations)

<div style="background-color:rgb(181, 191, 226); padding:10px 0;font-family:monospace; font-family:monospace">
{<br>
&nbsp;&nbsp;inputs: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ outpoint: ( "cc6a...d169", 0 ), sig: "13f1...bc79...8c0b" }<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ outpoint: ( "3a64...58a0", 3 ), sig: "680b...ac27...eae8" }<br>
&nbsp;&nbsp;],<br>
&nbsp;&nbsp;outputs: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ pk: "36de...6a69", amount: 7400900000000 }<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ pk: "f71c...6630", amount: 2710200000000 }<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ pk: "d916...e467", amount: 1535700000000 }<br>
&nbsp;&nbsp;]<br>
}
</div>

### 3.10 Transaction validation
- Validating an incoming transaction means that nodes update their transaction history graph. The process goes as follows:
    - *Transaction validation* ie. checking that a particular transaction is rightfully spending the crypto that it is claiming.
        - 1. Tx arrives at the door of a receiver for the 1st time, for each input he resolves the respective outpoint
            - (a) checks that outpoint is in his current UTXO set
            - (b) retrieves the value amount and pub key from outpoint
            - (c) checks that a signature on the new Tx data verifies using the pub key of the outpoint
        - 2. Ckecks that conservation law holds (or that its a valid coinbase/first minted transaction)
        - 3. Removes the outpoints from the current UTXO set
        - 4. Adds the new outpoints of the Tx to its latest UTXO set
    - *Gossips* the new updated UTXO set to the network
- Let's linger on point 1.a). there since its crucial to check ownership of crypto, and double spending. If we face the scenario where a new Tx is NOT in the current UTXO set:
    - $\mathcal{A}$ created a Tx trying to spend from an nonexistent outpoint
    - *benign reason* - a timing/racing problem ie. $\text{tx}_1$ is created first, then $\text{tx}_2$ spends some outpoint from $\text{tx}_1$. However, the verifier may recieve $\text{tx}_1, \text{tx}_2$ in a different order that they were send. In this scenario the validator MUST reject $\text{tx}_2$ because he cannot know if a prevoius $\text{tx}_1$ exists in the first place (could be $\mathcal{A}$ attempting to spend a non-existing outpoint as above) 
    - *Double spending* - from the point above could also be the case that the output from $\text{tx}_1$ exists but was immediately removed because it's been spend already and the new $\text{tx}_2$ is trying to **double spend** it. In this scenario the validator must reject it
        - **Definition 12** (Double spending). *In the UTXO model a $\text{tx}$ is a* **double spend** *or a conflicting transaction with another transaction $\text{tx}^\prime\neq\text{tx}$, if $\text{tx}$ and $\text{tx}^\prime$ both have some outpoint in their inputs that is the same ie.* $\exists i,j\in\mathbb{N}:\text{tx.ins}[i]\text{.outpoint}=\text{tx}^\prime\text{.prime}[j]\text{.outpoint}$
- Transactions broadcast from different parts of the network may arrive in a different order in other parts of the network. As different nodes on the network see different transactions at different times, each node may have a different opinion on what their current UTXO set is. This can lead to race conditions, which we tackle in  the next chapter.
