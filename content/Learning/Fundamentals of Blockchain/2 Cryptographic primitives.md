## 2.1 Hash functions
- So we've seen that in the *gossip protocol* nodes exchange information objects, its essential to label them with a unique identifier
    - Since there is no notion of ordering while the protocol is running we discard counting and also random numbers because we want uniqueness
    - Then we use hashes as unique identifiers: $H:\{0,1\}^\ast\rightarrow\{0,1\}^\kappa$ which take whatever sized string and output a $\kappa$-bits long string
    - *Cryptographic hashes* are great *compression* functions that also are polynomially computable
- Next on we'll define three key properties around resistance against $\mathcal{A}$: *collision, preimage & 2nd-preimage resistance*

```pseudo data-title-prefix="Algo"
\begin{algorithm}
\caption{Collision-finding game for a hash function $H$}
\begin{algorithmic}
\Function{collision-game}{$\kappa$}
    \State $x_1, x_2 \gets \mathcal{A}(1^\kappa)$
    \State \Return $H_\kappa(x_1)=H_\kappa(x_2)\wedge x_1\neq x_2$
\EndFunction
\end{algorithmic}
\end{algorithm}

\begin{algorithm}
\caption{Preimage-finding game for a hash function $H$}
\begin{algorithmic}
\Function{preimage-game}{$\kappa$}
    \State $x \sim P_{\text{uniform}} \gets ^\$ \{0,1\}^\kappa$
    \State $y \gets H_\kappa(x)$
    \State $x^\prime \gets \mathcal{A}(y)$
    \State \Return $H_\kappa(x^\prime)=y$
\EndFunction
\end{algorithmic}
\end{algorithm}

\begin{algorithm}
\caption{2nd-preimage-finding game for a hash function $H$}
\begin{algorithmic}
\Function{2nd-preimage-game}{$\kappa$}
    \State $x_1 \sim P_{\text{uniform}} \gets ^\$ \{0,1\}^{2\kappa + 1}$
    \State $x_2 \gets \mathcal{A}(x_1)$
    \State \Return $H_\kappa(x_1)=H_\kappa(x_2)\wedge x_1\neq x_2$
\EndFunction
\end{algorithmic}
\end{algorithm}
```

### Collision resistance
- In short, for $\mathcal{A}$ to break collsion resistance she has to freely chose both inputs $x_1,x_2$ such that: $\forall x_1,x_2:x_1\neq x_2\Rightarrow H(x_1)= H(x_2)$
- Because of Pigeonhole theorem ie. if the universe of preimage is larger than hash image then collisions will exist
    - **Theorem 2** (Pigeonhole). *Consider a function $f:A\rightarrow B$. If $|A|>|B|$, then there must exist some inputs $x_1, x_2$ such that $f(x_1)=f(x_2)$*
    - thus, **collisions** are inevitable, some algorithms to find the problematic inputs are
        - start feeding inputs to $H$, starting w/ $x=0$ and going up to $2^\kappa-1$, if there hasn't been a collision until then $\Rightarrow$ we are certain that the next input will yield a collision
        - Brute force search, runs in exponential time $2^{2\kappa}$ where we use two for loops one for $x_i$ and the other for $x_j$ aiming to find $(i,j)\wedge H(x_i)=H(x_j)$
        - *Collision-finding game* - initialize the adversary $x_1,x_2\leftarrow\mathcal{A}(1^\kappa)$ and let her produce two different inputs (she may have them hard coded) that have the same $\kappa$-bit output hash $H_\kappa(x_1)=H_\kappa(x_2)\wedge x_1\neq x_2$
        
- From the last point, the adversary may have a list of hard coded collisions, but for sufficiently large values of $\kappa$ ie. more secure hash function, these may not work
    - **Definition 5** (Collision Resistance). *A hash function $H:\{0,1\}^\ast\rightarrow\{0,1\}^\kappa$ is collision resistant if:* $\forall\text{PPT}\mathcal{A} : P[\operatorname{collision-game}_{H,\mathcal{A}}(\kappa)=1]\leq\operatorname{negl}(\kappa)$


### Preimage resistance
- In preimage resistance $\mathcal{A}$ is provided a hash output and should be unfeasible to find the preimage $x$ that produces such hash
    - **Defintion 6** (Preimage Resistance). *A hash function $H:\{0,1\}^\ast\rightarrow\{0,1\}^\kappa$ is preimage resistant if* $\forall\text{PPT}\mathcal{A}: P[\operatorname{preimage-game}_{H,\mathcal{A}}(\kappa)=1]\leq\operatorname{negl}(\kappa)$
    
#### Second preimage resistance
- In second preimage resistance $\mathcal{A}$ is handed a preimage $x_1$ and its image $H(x_1)$ and should be unfeasible to find another input $x_2$ that produces the same image
    - **Definition 7** (2nd-Preimage Resistance) *A hash function $H:\{0,1\}^\ast\rightarrow\{0,1\}^\kappa$ is 2nd-preimage resistant if* $\forall\text{PPT}\mathcal{A}: P[\operatorname{2nd-preimage-game}_{H,\mathcal{A}}(\kappa)=1]\leq\operatorname{negl}(\kappa)$

- As we can see there is some deductive hierarchy in strength of theorems:
    - **Theorem 3** (Collision Resistance $\Rightarrow$ 2nd Preimage Resistance). *If a hash function $H$ is collision resistant, then it is 2nd-preimage resistant*
    - **Theorem 4** (2nd Preimage Resistance $\Rightarrow$ Preimage Resistance). *If a hash funciton $H$ is 2nd-preimage resistant, then it is preimage resistant*
    
- *Intuitive soft proofs*:
    - Proof of Theorem 3 (by contradiction) - suppose another $\mathcal{A}$ that can break $H$ in 2nd-preimage and serves $\mathcal{A}^\prime$ in its mission to break collision. First, $\mathcal{A}^\prime$ chooses $x_1\sim P_\text{uniform}$ from the message space and then hands it to $\mathcal{A}$ who, based in our assumption, overcomes Definition 7 w/ non-negligible prob, producing an $x_2$ such that $x_1\neq x_2 \wedge H(x_1)=H(x_2)$. Then, returns this output to $\mathcal{A}^\prime$ who produces the final output $(x_1,x_2)$. If $\mathcal{A}$ breaks 2nd-preimage w/ non-negligible prob then $\mathcal{A}^\prime$ will break collision w/ non-negligible prob as well. However, because both $\mathcal{A},\mathcal{A}^\prime$ are PPT this contradicts the assumption that $H$ is collision resistant $\square$
    - Proof of Theorem 4 - a lot more complicated

    
### Gossiping with hashses
- Collision resistance ensures that objects are uniquely *content-addressible*
- Hashes are so useful that allow to advertise unique objects without revealing its contents
- In the gossiping process, instead of sending the whole object to peers it is more efficient to advertise its hash (*objectid*)
    - If a peer is already aware of the object, then they can simply ignore it. If not they can request the object through its *objectid* and verify its hash upon delivery
    - Moreover, gossiping w/ hashes allows anonymity ie. $B$ doesn't have a way of knowing if object $O$ was generated by $A$'s IP addr or simply relayed.

<img src="Learning/images/blockchain/ch021-gossiping-hashes.png" width="60%">


### Hash security 
- Because collision resistance is the stronger resistance proof its the only requisite to call a hash function *cryptographically secure*
    - **Definition 8** (Secure Hash Function). *A hash function $\{0,1\}^\ast\rightarrow\{0,1\}^\kappa$ is secure if there is a negligible function $\operatorname{negl}$ such that:* $\forall\text{PPT}\mathcal{A}: P[\text{collision-game}_{H,\mathcal{A}}=1]\leq\operatorname{negl}(\kappa)$
    
## 2.2 Signatures
- Signatures are used to prove to the rest of the network that a balance transfer was really authorized by the sender. Signatures are part of a *cryptographic scheme*, which is a protocol used to achieve certain security objectives

### Public key cryptograpy
- Lets state the distinction between identity in legacy and blockchain systems
    - *Legacy* - identity is tied to a person as info in the government's database and has a correspondent physical card (passport) that is accepted
    - *Blockchain* - identity can be *pseudonymous* and an actor can have multiple ones. Idenity is a tuple of a private $sk$ and public key $pk$
        - for any identity there is a tuple of uniquely related $sk$ and $pk$ 
        - given a private key, it is easy to get the respective public key. Given a public key, it is hard to get the respective private key

### Unforgeability
- A special algorithm $\operatorname{Gen}(1^\kappa)$ creates the key pair $(sk,pk)$ which are $\kappa$-bits long strings each
- A function $\operatorname{Sig}(sk, m)=\sigma$ can create unique signatures from a private key $sk$: a particular signature $\sigma$ is related to a particular message $m$ (a different message $m^\prime$ is associated w/ a different signature $\sigma^\prime$)
    - A receiver of message $m$ can invoke a boolean function $\operatorname{Ver}(pk, m, \sigma)$ to check the veracity of the message and if was truly produced by the sender (whose pub key is $pk$)
    - **Definition 9** (Signature Correctness). *Consider a signature scheme $(\operatorname{Gen}, \operatorname{Sig}, \operatorname{Ver})$. The scheme is correct if for any key pair $(pk,sk)$ generated by invoking $\operatorname{Gen}$, and $\forall m$ it holds that $\operatorname{Ver}(pk,m,\operatorname{Sig}(sk,m))=\text{true}$*
- **Forgery** is when the adversary succeeds in breaking the cryptographic scheme. Lets describe scenarios w/ (incremental) power 
    - Invoke $\operatorname{Gen}$ blindly, only knowing $pk$ and trying to decipher $sk^\mathcal{A}=sk$
    - Inspect previous messages $m$ signed by $(pk, sk)$ to try to decipher $sk^\mathcal{A}=sk$
    - Make the honest party sign adversary-produced-messages $m^\mathcal{A}$ in conjunction to the two above to try to decipher $sk^\mathcal{A}=sk$

```pseudo
\begin{algorithm}
\caption{Existential forgery game for signature scheme $(\operatorname{Gen},\operatorname{Sig}, \operatorname{Ver})$}
\begin{algorithmic}
\Function{existential-forgery-game}{$\kappa$}
    \State $(pk, sk) \gets \operatorname{Gen}(1^\kappa)$
    \State $M \gets \emptyset$
    \Function{O}{$m$}
        \State $M \gets M\cup\{m\}$
        \State \Return $\operatorname{Sig}(sk,m)$
    \EndFunction
    \State $m \notin M,\sigma \gets \mathcal{A}^\mathcal{O}(pk)$
    \State \Return $\operatorname{Ver}(pk,\sigma,m)\wedge m\notin M$
\EndFunction
\end{algorithmic}
\end{algorithm}
```


- Algo 9 shows the game that $\mathcal{A}$ needs to run in order to achieve forgery. a pair of keys are created upon invoking $\operatorname{Gen}$, then the (appendable) message set is initiated as empty. The closure function $\mathcal{O}$ is defined from within which appends messages to the message set $M$ and returns just a signature associated to a particular $m$. Next on, the adversary is initialized by having access only to the pub-key $pk$ and can query signatures (of messages but NOT the messages) from the oracle function $\mathcal{O}$ as many times as she wishes. When she thinks she is ready to give a shot at deciphering $m$ she can then check her try via $\operatorname{Ver}=\text{true}\mid \text{false}$
    - **Definition 10** (Secure signature scemes). *A signature scheme $(\operatorname{Gen}, \operatorname{Sig}, \operatorname{Ver})$ is called secure if there exists a negligible function $\operatorname{negl}$ such that*: $\forall\text{PPT}\mathcal{A}: P[\operatorname{existential-forgery}_{\operatorname{Gen},\operatorname{Sig}, \operatorname{Ver},\mathcal{A}}(\kappa)=1]< \operatorname{negl}(\kappa)$ 
    
### Applied signatures
- Signing the hash of a message is sufficient (rather than signing the entire message)
- One of the most used signature schemes is based in **elliptic curves** which define how public keys are structured and guarantees that is hard to calculate a private key based on its pub key
    - ie: `ECDSA`, `secp256k1`, `ed25519`
    - *note.-* we'll abbreviate keys/hashes as a 4 letter head and tail sepparated by lower dots and a full signature as head + middle chunk + tail, eg: 
        - private key $sk$: `1498...7d93`
        - pub key $pk$: `b7a3...4cde`
        - full signature $\sigma$: `6dd3...babf...4e08`
        <div style="background-color:rgb(181, 191, 226); padding:10px 0;font-family:monospace; font-family:monospace">
        <font color = "gray"># <strong>Example of ed25519 signature scheme</strong></font><br>
        Private key (32 bytes): b'1498b5467a63dffa2dc9d9e069caf075d16fc33fdd4c3b01bfadae6433767d93'<br>
        Public key (32 bytes):  b'b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f25e5f92444cde'<br>
        Signature (64 bytes): b'6dd355667fae4eb43c6e0ab92e870edb2de0a88cae12dbd8591507f584fe4912babff497f1b8edf9567d2483d54ddc6459bea7855281b7a246a609e3001a4e08'<br>
        </div>
- A seminal paper on cryptography: [Cryptographic hash-function basics: Definitions, implications, and separations for preimage resistance, second-preimage resistance, and collision resistance](https://eprint.iacr.org/2004/035.pdf).

