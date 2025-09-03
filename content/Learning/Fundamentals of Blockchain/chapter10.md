# E-374

# Chapter 10

# Light Clients

### 10.1 Motivation
- *Full nodes* operate w/ a huge wrokload, we face three main scalability issues: 
    - storage requirements - full nodes store the entire chain (~1TB in Bitcoin)
    - communication requirements - full nodes boradcast, request & download every transaction & block submitted to the network
    - computation requirements - full nodes validate all incoming transactions & blocks, then compute the UTXO set, etc...
- We seek to design a *light client/node* such that it requres less load on each point above

### 10.2 Definition
- *Light clients/nodes* in the blockchain can verify payments and create transactions w/ much less worload:
    - needs less storage (lets aim at ~100MB)
    - communicates less w/ the network (only downloads $\text{txs}$ pertinent to an address)
    - requires less computation power (will not validate all $\text{txs}$ in the DAG)
- Furthermore they are connected ONLY w/ full node peers (rather than other light clients) to ensure availability of information

### 10.3 Header Chains
- Light clients store a chain of **block headers** (hash of a block w/ format $s\| \vec{x} \| \text{ctr}$) rather than the whole transaction vector

#### 10.3.1 Blockc Validation
- Block validation for chains of headers follow a slightly modified process:
    - *(i)* download the new  block header *(ii)* validate the header PoW and ancestry *(iii)* download the block body *(iv)* check block validity (ie. transaction set & merkle tree)
    
#### 10.3.2 Benefits
- Block headers solve all three of our problems:
    - significantly reducing size by storing only $3 \kappa$
