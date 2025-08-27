# EE-374
Course contentrates on what are blockchains and more generally re-answer, perhaps with a lot more coherence, the following questions:
- What  are blockhains?
- How do they work?
- Why are they secure?

# Chapter 1
# A Big Bad World
### 1.3 The Nature of Money
- Before money there was only credit/debt and money is an instrument to measure it
- Money can be almost anything: from prehistoric money to bits in some bank's computers. 
- Any kind of money derives its value from the the assumption that other people recognize and accept it as valuable (**Money is a belief system**)
    - This belief system is build from human relationships based on trust 
    - Demistifying: no barter society have  ever existed prior to the invention of money
- Each monetary transaction is never a private event between the two (or more) interacting parties because it transaltes to a claim upon society
- This gives rise to the need of **consensus** in the economic system (/community)
    - Monetary transactions must ensure its participants that any new configuration of money ownership and future transactions will still be accepted by the community in some future time
    - Judgement of validity has two parts: *(1)* money is minted legitimately and *(2)* money to be spend rightfully belongs to the party who is about to spend it and hasn't been spend before (**double spending problem** - is all about ownership tracking)
    
#### Consensus requires trust
- The consensus problem is solved differently depending on the type of money
    - With physical money problem of minting is the only one needed to be solved (eg. imprint a royalty mark in a coin or watermarks on paper bills) because the problem of double spending is trivially solved (when a person pays with a coin he doesn't physically posses that coin anymore)
- When we digitalize money then the matter comes to whom do we outsource trust?
    - eg. if private legacy banks are the thrid party that we put our trust on, then consensus of the validity of a transaction occurs when a vendor's terminal connects to the bank's servers, updates the new spent balance and settles
    - Bank's protocols and payment processors are the judges of a validity of a transaction
- The cyberpunk movement and cryptographers working on protocolos are adverse to outsourcing trust to these kind of third parties because power is centralized
- Outsourcing trust to third parties is undesirable because:
    - (1) authority may fail, not only because of malicious reasons but because of mistakes
    - (2) authority may become corrupted in the future, creating the possibility of abuse
    - (3) authority may be honest but external adversaries may breach into its systems and corrupt it
    - (4) different regional authorities may not have trust on a mutual authority eg. country level - US federal reserve doesn't trust China's central bank and viceversa

#### Shifting trust from third parties to trust on protocols
- If a bank acts maliciously the tratment for such adversarial behavior is legal. On the other hand, in blockchains/decentralized networks the treatment to adversarial behavior is *self-enforced* punishment baked into the protocol
- Because money and contracts are just a social construct conjured by social delusion we can rebuild money in the form of code as long as we recreate its essential properties: *scarcity, minting and ownership tracking* and then convince people to adopt it
    - So we can decentralize money by removing institutions of trust eg. banks and the central bank $\Rightarrow$ in this scenario people are their own banks
    - Replace money with a cryptocurrency and replace the social/legal agreements to transact w/ smart contracts
    - When these are implemented in code rather than a blob of large third party insitutions, they can be analyzed in the theoretical framework of CS and become precise & explicit rather than implicit
    
### 1.2 The adversary
- Distributed consensus systems must be designed considering the presence of an *adversary* player $\mathcal{A}$ who tries to break trust (we'll disign our system against a truly powerful and truly malicious adversary). On the other hand, the *honest* player(s) act within the protocol's ($\Pi$) rules. 
    - Ideally, we want our protocol to survive and remain operational as long as a country’s Internet infrastructure is operational
    - Security must be embedded in the protocol and incentive (disincentive) mechanisms must favor (disfavor) good (bad) players
    - We model both, adversary and honest parties, as turing machines connected in an environment of a common communication network
- The critical part to prove security of the network is to limit the adversary to run in **polynomial time** wrt its input size (lets coint these PPT: *probabilistic polynomial time*)
    - Additionally we allow the adversary access to randomness
    - Same constraints apply to the honest parties

### 1.3 Game-based security
- We'll be defining what security properties we want our protocols to have. A first step is to state that: 
    - A protocol $\Pi$ is secure if it is impossible for an adversary $\mathcal{A}$ to break it 
- 'breaking' the protocol will depend on its particular design and the security goals for the protocol will be described in terms of a *cryptographic game*
    - We are interested in evaluating the performance of PPT adversaries against the game if its *true* $\Rightarrow$ the adversary was successful in breaking the protocol
    - We'll run these games by calling $\Pi$ and $\mathcal{A}$ from source code into the (other) code that is the game
    - The execution of the game never occurs in the real protocol its just a tool to argue about security
- Lets define a security param $\kappa$ (respresents the probability of failure we are willing to accept)
    - Our protocol will tolerate $\kappa=256 \rightarrow 2^{-\kappa}=2^{-256}$
    - Which is extremely small, tecnically it NEVER OCCURS (it is more probable that a global earth catastrophy is caused by an asteroid hitting earth during the *second you read this particular sentence* than a probability of $2^{-256}$ occurring)
- Both adversary and honest players run in polynomial time wrt the security param $p(\kappa)$
    - Initialize the adversary as $\mathcal{A}(1^{\kappa})$ (the length of the input is $\kappa$-th ones, because $|1^\kappa|=\kappa$)
    - Its innapropriate to intialize $\mathcal{A}$ as: 
        - passing no args $\mathcal{A}()$, would mean that the adversary has no time to perform the attack
        - passing $\mathcal{A}(\kappa)$, would mean that the adversary runs in $\log{\kappa}$ time (since $|\kappa|=\log{\kappa}$)

#### Negligibility
- *Negligible prob functions* (as probs for guessing keys) are the standard treatment in modern cryptography because they guarantee that probs cannot be further amplified
    - Say an adversary $\mathcal{A}$ succeeds in breaking a key with negligible prob. Then any other adversary $\mathcal{A}^\prime$ must run te simulation in *exponential time* to achieve anything beyond negligible (which is impossible because PPT is our constraint)
        - **Definition 1** (Negligible function) A function $f(\kappa)$ is negligible if for any polynomial degree $m\in\mathbb{N}$, there exists a $\kappa_0$ such that for all $\kappa > \kappa_0$: $f(\kappa)<\frac{1}{\kappa^m}$
    - Operations of negligible functions guarantee that the result is also negligible ie. 

\begin{align}
\operatorname{negl} \cdot \operatorname{negl} = \operatorname{negl} \\
\operatorname{const} \cdot \operatorname{negl} = \operatorname{negl} \\
\operatorname{poly} \cdot \operatorname{negl} = \operatorname{negl} \\
\forall k \in \mathbb{N}: \operatorname{negl}^{k} = \operatorname{negl}
\end{align}


#### Definitions of security
- The *challenger game* is our math tool algorithm to argue about security. We initialize $\Pi, \mathcal{A}$ wrt $\kappa$ 
    - The ideal goal (unnatainable) is to have the output: $\forall \text{PPT}\mathcal{A}:\operatorname{Game}_{\Pi, \mathcal{A}}(\kappa)=0$
    - But we can conform with 
        - **Definition 2** (Security). *A protocol $\Pi$ is secure wrt $\operatorname{Game}$ if there exists a negligible function $\operatorname{negl}(\kappa)$ such that: $\forall \text{PPT}\mathcal{A}: P[\operatorname{Game}_{\Pi,\mathcal{A}}(\kappa)=1]\leq\operatorname{negl}(\kappa)$*
        - note that we are considering a probabilistic result of $P[\operatorname{Game}]$ since there can be many attempts/trials
    - If the key is bi-valued $\{0,1\}^{\kappa}$ w/ bit length $\kappa$ then the probability of guessing the key is $\frac{1}{2^\kappa}$ but the adversary runs in poly-time so applying a *Union Bound*, the prob of guessing the entire key is $\frac{p(\kappa)}{2^{\kappa}}$
        - **Theorem 1** (Union Bound). *Consider $n$ events $X_1,X_2,\ldots,X_n$ then the prob that any one of them occurs is given by their union bound:* $P[X_1,X_2,\ldots,X_n]=P[X_1]+P[X_2]+\ldots+P[X_n]$
        
#### The honest/adversarial gap
- The honest/adversarial gap refers to the following disparity: an honest party only needs polynomial time to successfully participate in the protocol whereas an adversary needs super-polynomial time (exponential or greater) to break it
    - We can say that a successful $\Pi$ ($\mathcal{A}$) party is efficient (inefficient) and lives within $P$ ($NP$) complexity time 
    - With the power of these principles we can make a rather bold claim: Blockchain/distributed tech achieves something more powerful and secure than current legacy monetary systems! $\Rightarrow$ we only rely on a PPT constraint (which is btw embedded within the protocol design) to ensure the system's security. Whereas legacy systems require huge resources to run w/ sub-optimal security eg. an entire governemnt + many other institutions (central bank, coordination w/ private banks) + legal system + armed security to guard centralized computers running closed source protocols where few ppl call the shots.
    
#### Proofs of security
- The scope of this course is concerned to build a secure blockchain protocol. For this matter we'll take many underlying primitives for granted. 
    - If no PPT adversary wins in the underlying protocol except w/ negligible prob $\Rightarrow$ also no PPT adversary can win in our protocol except w/ negligible prob
    - **Claim.** If protocol $\Pi^\ast$ is secure, then protocol $\Pi$, build on top of $\Pi^\ast$ is also secure.
        - Check the course textbook for proofs by contradiction and/or forward direction
        
### 1.4 The network
Participants are nodes on a computer network, each run software and communicate w/ one another

#### The non-eclipsing assumption
- In this configuration not everyone is connected to everyone else. Nonetheless, messages can reach all nodes via the *gossiping protocol*. 
    - To avoid denial-of-service attacks some safety-guardrails are implemented (eg. validating messages before spreading them)
    - **Definition 3** (Non-eclipsing assumption). *Between every two honest parties on the network, there exists a path consisting only of honest nodes*

<img src="images/ch014-eclipsed-network.png" width="60%">


#### The sybil attack
- Recall that we want to design a protocol in the presence of a very powerful adversary, an example of this is
    - **Definition 4** (Sybil Attack). *In a Sybil attackable network model, the adversary may create as many identities as she desires. The honest parties cannot distinguish which identities have been created by the adversary in this manner*
        - It is possible that the adversasry controls all the connections of an honest node except for one connection w/ another honest party

<img src="images/ch014-sybil-attack.png" width="60%">

#### Peer discovery
- *Peer discovery* refers to the process of connecting to other nodes, attempting to ensure at least one honest connection. Briefly the sequence of steps are
    - *network boostrapping* phase - a P2P node at first boot must connect to a list of hard-coded IP addresses and at least get one honest node connection. 
    - Once connected it can ask the peer to share a list of other node's IPs (which depending on the protocol may be partially shareable to avoid censorship or compromising the entire list)


#### Problems
##### 1.1 Which are negligible functions?



```python
import numpy as np
import matplotlib.pyplot as plt
```


```python
x = np.arange(1, 10, .1)
y = lambda xi: 1 / xi
```


```python
plt.scatter(x, y(x))
# plt.scatter(, color="red")
plt.xlabel(r"$x\in\mathbb{N}$")
plt.ylabel(r"$\frac{1}{x}$")
```




    Text(0, 0.5, '$\\frac{1}{x}$')




    
![png](chapter01_files/chapter01_5_1.png)
    



```python
x = np.arange(1, 2, .01)
plt.scatter(x, F(x))
plt.scatter(x, Finv(x), color="red")
plt.xlabel(r"$x\in\mathbb{N}$")
plt.ylabel(r"$\frac{1}{x}$")
plt.lenge
```




    Text(0, 0.5, '$\\frac{1}{x}$')




    
![png](chapter01_files/chapter01_6_1.png)
    

