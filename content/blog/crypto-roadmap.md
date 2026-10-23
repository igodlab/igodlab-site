# A one-year curriculum: FHE, CKKS, and NTT

**Goal**: computational fluency — you can read a paper, implement a scheme from scratch in a weekend, use production libraries competently, and reason about parameter choices and noise budgets. Not PhD-level (you won't prove new hardness reductions), but you'll be past "black box user." Given a CUDA background, this version also aims for you to be able to read, extend, and eventually contribute to a GPU-accelerated FHE library — see the dedicated GPU track below.

**Run code and math in parallel from day one, not sequentially.** Don't wait until the math is solid to touch a real library — that gap should be days, not months. In your very first week, before any heavy math: install [OpenFHE](https://github.com/openfheorg/openfhe-development), run its plain CKKS example on CPU, and poke at it — encrypt a vector, inspect the ciphertext object's raw structure, multiply, inspect again. You won't understand what you're looking at yet; that's fine. It gives you concrete objects to hang each piece of math onto as you learn it, rather than absorbing theory in a vacuum. As each Q1/Q2 topic below clicks, go find where it shows up in that same OpenFHE trace: learn about the moduli chain → inspect what `CryptoContext` parameters set it; learn rescaling → find the `Rescale` call and watch ciphertext levels drop. This is distinct from the GPU track further down — this is about closing the gap between abstract math and a running CPU program, using a library whose semantics you can trust, before you go anywhere near optimized CUDA code (see the GPU track's own honesty note about why library-reading is a bad *substitute* for the math, even though it's a great *companion* to it).

Given your FFT background specifically: NTT will click faster than it does for most people, since it's the same Cooley-Tukey butterfly structure over a finite field instead of over the complex numbers. Don't over-invest in Q1's Fourier-intuition material below — skim it for confirmation rather than treating it as new territory, and spend the saved time on the finite-field-specific wrinkles (why the modulus needs a specific form, what a primitive root of unity in ℤ/pℤ is) that don't have an FFT analog.

**Time assumption**: roughly 6-10 hrs/week, adjust pacing to your actual availability.

---

## Quarter 1 (Months 1-3): Math foundations

You cannot shortcut this. Every FHE paper assumes fluency here.

**Topics**
- Modular arithmetic, groups, rings, fields — especially finite fields
- Polynomial rings, and specifically **quotient rings** like ℤ[x]/(xⁿ+1) — this exact ring is the home of almost every lattice scheme
- Basics of lattices: what a lattice is, shortest vector problem (SVP), why it's believed hard
- The Learning With Errors (LWE) problem and its ring variant (RLWE) — you need to be able to *state* these problems precisely, not just wave hands
- Discrete Fourier Transform (DFT) → Fast Fourier Transform (FFT) — prerequisite intuition before NTT

**A running reference, not a single-quarter read**: Ronny Ko's [*The Beginner's Textbook for Fully Homomorphic Encryption*](https://arxiv.org/abs/2503.05136) deserves special mention because it spans Q1 through Q3 in one consistently-notated document — Part I covers exactly the Q1 math (including a full NTT derivation), Part II/III covers the Q2 generic FHE mechanics, and Part IV's CKKS chapter covers Q3. It's unreviewed (arXiv only, informally checked by two real FHE researchers) and proof-heavy rather than gentle despite the title — treat it as the spine you work through gradually across three quarters alongside the primary-source papers below, not a beginner-friendly linear read, and not a substitute for hands-on library work since it contains zero code.

**Resources**
- Chris Peikert, [*A Decade of Lattice Cryptography*](https://eprint.iacr.org/2015/939) — free PDF survey, the best single on-ramp to SIS/LWE/RLWE
- [MIT CSAIL FHE reference list](https://people.csail.mit.edu/vinodv/FHE/FHE-refs), maintained by Vinod Vaikuntanathan — a curated, chronological list of nearly every foundational FHE paper, useful as a map for the rest of the year
- Any standard abstract algebra refresher (Dummit & Foote for reference, don't read cover to cover — just rings/fields chapters) — or use Ko's Part I (§A-1 to §A-16) as a more FHE-tailored substitute
- 3Blue1Brown, [*But what is the Fourier Transform? A visual introduction*](https://www.youtube.com/watch?v=spUNpyF58BY) — with your FFT background this is optional review, not new material; skim rather than watch in full

**Milestone**: implement basic modular polynomial arithmetic (add, multiply naively) in Python from scratch. Implement a textbook DFT and FFT. No libraries. In parallel, do the day-one OpenFHE install-and-poke exercise described above — don't wait for this milestone to finish first.

---

## Quarter 2 (Months 4-6): NTT and classical FHE schemes

**Topics**
- The Number Theoretic Transform: FFT's finite-field cousin. Understand *why* you need a prime with a specific form (p ≡ 1 mod 2n) and what a primitive root of unity in ℤ/pℤ is
- Negacyclic convolution and how NTT handles the xⁿ+1 structure
- Somewhat Homomorphic Encryption (SHE): noise growth under addition/multiplication, why multiplication is the expensive operation
- Gentry's bootstrapping idea (conceptually — the "squash and evaluate the decryption circuit homomorphically" trick). You don't need to implement bootstrapping yet, just understand *why* it's necessary
- BGV and BFV schemes (exact integer arithmetic) — these are simpler than CKKS and a better first full scheme to study

**Resources**
- Craig Gentry, [*A Fully Homomorphic Encryption Scheme*](https://crypto.stanford.edu/craig/craig-thesis.pdf) (2009 Stanford PhD thesis) — skim it for the bootstrapping idea, don't try to absorb every proof
- Brakerski, Gentry, Vaikuntanathan, [*Fully Homomorphic Encryption without Bootstrapping*](https://eprint.iacr.org/2011/277) — the BGV paper
- Fan & Vercauteren, [*Somewhat Practical Fully Homomorphic Encryption*](https://eprint.iacr.org/2012/144) — the BFV paper
- Ko's Part II/III (§B-1 to §C-5) — read this *before* the BGV/BFV papers above; it's formula-complete rather than proof-of-existence-focused, which makes the papers easier to parse afterward
- [Microsoft SEAL GitHub](https://github.com/microsoft/SEAL) — SEAL implements BFV and CKKS and has genuinely good comments explaining the math inline

**Milestone**: implement a toy NTT-based polynomial multiplier and benchmark it against your naive multiplier from Q1. Implement a minimal BFV encrypt/decrypt/add (multiplication can wait) using your own NTT.

---

## Quarter 3 (Months 7-9): CKKS specifically

**Topics**
- What makes CKKS different: it encodes **approximate** real/complex numbers rather than exact integers, via a clever encoding using the canonical embedding
- Rescaling — CKKS's mechanism for managing the "noise" that comes from approximate arithmetic (analogous to floating point scaling)
- Encoding/decoding vectors of complex numbers into a single polynomial slot structure — this is the part people find most conceptually slippery, spend real time here
- Levels and the multiplicative depth budget — why every CKKS computation has a fixed "depth" you must plan around before encrypting
- CKKS bootstrapping (conceptually — it's genuinely one of the harder topics in the whole field, a light pass is fine here)

**Resources**
- Cheon, Kim, Kim, Song, [*Homomorphic Encryption for Arithmetic of Approximate Numbers*](https://eprint.iacr.org/2016/421) (2017 Asiacrypt / the original CKKS paper) — read this closely, it's the center of your year
- Ko's Part IV, CKKS chapter (§D-3) — read before the paper above for the mechanics; it's more formula-complete on encoding/decoding and both relinearization methods than the paper alone
- Yongsoo Song (CKKS co-author), [*Introduction to CKKS*](https://yongsoosong.github.io/files/slides/intro_to_CKKS.pdf) — a slide deck from the author himself, walks through rescaling and encoding more gently than the paper
- [Microsoft SEAL GitHub](https://github.com/microsoft/SEAL) — its CKKS examples (4.x) are worth actually running; modify parameters and watch what breaks
- [homomorphicencryption.org/standard](https://homomorphicencryption.org/standard/) — the community security-standard site, useful for understanding real parameter choices instead of toy examples
- [*Security Guidelines for Implementing Homomorphic Encryption*](https://eprint.iacr.org/2024/463) (2024) — a practical, up-to-date reference on parameter selection and pitfalls, written for implementers rather than theorists
- Li & Micciancio, [*On the Security of Homomorphic Encryption on Approximate Numbers*](https://eprint.iacr.org/2020/1533) (2020) — read this once CKKS mechanics feel solid, not before. It demonstrates a practical, full key-recovery attack against CKKS as originally specified, exploiting the fact that decrypted *approximate* results leak information the exactness-based IND-CPA security definition didn't account for — and the attack worked against HEAAN, SEAL, HElib, and PALISADE's actual implementations, not just a theoretical model. This is the canonical case of an FHE implementation being computationally correct while being cryptographically broken: the code ran fine and produced the expected approximate answers, but the security guarantee it was supposed to provide didn't hold whenever decrypted outputs were ever revealed to an adversary. Worth internalizing early: production libraries fixed this by tightening their APIs, but it's a good reminder that "it runs and gives the right numbers" is not the same as "it's secure."

**Milestone**: using SEAL or OpenFHE (not your own implementation), implement encrypted dot product and encrypted polynomial evaluation on real-valued vectors. Then, separately, extend your own toy scheme from Q2 toward CKKS-style encoding — doesn't need to be fast or secure, just correct.

---

## Quarter 4 (Months 10-12): Applications, tooling, and a capstone

**Topics**
- Practical libraries at production quality: OpenFHE (C++, most actively maintained, supports BGV/BFV/CKKS/TFHE), Microsoft SEAL, TenSEAL (Python wrapper over SEAL, good for ML use cases), Lattigo (Go)
- Encrypted machine learning inference — the most common real-world CKKS use case (linear layers, approximated activations)
- Performance: why FHE is slow, what people do about it (SIMD packing/batching into ciphertext slots, GPU acceleration efforts, hardware accelerators like those from DARPA's DPRIVE program)
- A brief look at TFHE (fast bootstrapping, different tradeoffs) just so you know the shape of the alternative in the FHE family

**Resources**
- [OpenFHE GitHub](https://github.com/openfheorg/openfhe-development) and its [ReadTheDocs](https://openfhe-development.readthedocs.io/) — supports BGV, BFV, CKKS, and TFHE-family schemes with a common API; the CKKS examples are the ones to focus on
- [TenSEAL GitHub](https://github.com/OpenMined/TenSEAL) — Python wrapper over SEAL, purpose-built for encrypted tensor/ML workflows
- [Lattigo GitHub](https://github.com/tuneinsight/lattigo) — if you want a Go-based alternative, notably used in multiparty/distributed HE settings
- [awesome-he](https://github.com/jonaschn/awesome-he) — a curated list of essentially every HE library and resource worth knowing about; good to skim once you have basics down
- Zama, [*TFHE Deep Dive*](https://www.zama.ai/post/tfhe-deep-dive-part-1) (4-part blog series, parts 1–4 linked from part 1) — the best practically-minded, non-academic walkthrough of TFHE's ciphertext types, encodings, and bootstrapping
- [zama-ai/tfhe-rs GitHub](https://github.com/zama-ai/tfhe-rs) — production Rust implementation of TFHE, if you want hands-on time with the scheme outside the CKKS family

**Capstone project** (pick one, this is where fluency actually consolidates):
- Encrypted linear regression or logistic regression inference end-to-end using CKKS via OpenFHE/TenSEAL, benchmarked against plaintext
- A from-scratch NTT-based CKKS toy implementation, focusing on correctness of encode/decode/add/multiply/rescale (skip bootstrapping — genuinely hard even for experts)
- A parameter-selection and noise-budget analysis tool: given a target computation (depth, precision), compute safe polynomial degree and modulus chain

---

## GPU acceleration track — leveraging your CUDA background

You already know how to write and optimize GPU kernels. That skill is directly transferable here, so this track isn't "learn CUDA" — it's "learn the specific ways FHE's math maps onto (and fights against) the GPU execution model." Weave this in alongside the main quarters rather than after them; the insertion points below are deliberate.

**Why this maps well to what you know**: NTT is structurally a Cooley-Tukey-style butterfly computation, identical in shape to FFT — same divide-and-conquer, same in-place bit-reversal tricks, same shared-memory tiling opportunities. CKKS/BGV/BFV ciphertext operations (add, multiply, rescale, key-switch) are dominated by many independent NTTs and Hadamard (pointwise) products across RNS residues — highly parallel, but **memory-bandwidth-bound, not compute-bound**, which is the single most important fact to internalize; most of the published speedups come from kernel fusion and reducing global-memory round-trips, not from raw FLOP throughput.

**Insert after your Q1/Q2 naive NTT** — once you've implemented and understood NTT on CPU, port it to CUDA immediately, before going deeper into CKKS. This is where your existing skill compounds fastest:
- Shivdikar et al., [*Accelerating Polynomial Multiplication for Homomorphic Encryption on GPUs*](https://arxiv.org/abs/2209.01290) (2022) — the best applied paper for this specific exercise: GPU-optimized Barrett modular reduction, a 2D mixed-radix multi-block NTT, shared-memory tiling, and fusing the Hadamard product into NTT stages to cut twiddle-factor memory footprint in half. Treat this as a worked spec for your own CUDA NTT implementation.
- [cuFHE](https://github.com/vernamlab/cuFHE) / [cuHE](https://github.com/vernamlab/cuHE) (2018, TFHE-focused) — older and smaller than the modern libraries below, which makes them genuinely readable end-to-end in a weekend. A good "read real production-style GPU NTT code" step before tackling bigger modern codebases.

**Insert during Q3, after CKKS mechanics click via SEAL/OpenFHE** — now read production CKKS-on-GPU code:
- Jung et al., [*Over 100x Faster Bootstrapping in Fully Homomorphic Encryption through Memory-centric Optimization with GPUs*](https://eprint.iacr.org/2021/508) (CHES 2021) — the paper that established memory bandwidth, not compute, as CKKS's real GPU bottleneck; motivates kernel fusion as the primary optimization lever. Pair it with the companion code release, [scale-snu/ckks-gpu-core](https://github.com/scale-snu/ckks-gpu-core) — actual CUDA implementations of CKKS's core functions (base conversion, NTT, key-switching) that reproduce the paper's results.
- [PhantomFHE](https://github.com/encryptorion-lab/phantom-fhe) — a modern, actively maintained CUDA library implementing BGV, BFV, and CKKS, built partly from modified SEAL/OpenFHE code, so its internals are legible against libraries you already know from the CPU side.
- [FIDESlib](https://github.com/CAPS-UMU/FIDESlib) (ISPASS 2025) — a GPU CKKS library **interoperable with OpenFHE directly**, meaning you can prototype in OpenFHE on CPU and drop into this for GPU execution without changing scheme libraries. Given OpenFHE is your main library in Q4, this is the most natural bridge.
- [HEonGPU](https://github.com/Alisah-Ozcan/HEonGPU) — actively maintained, supports BFV/CKKS/TFHE with a clean C++ interface over the CUDA kernels; good for seeing how a library designer hides GPU complexity behind an ergonomic API, which is useful if your capstone involves building something similar.

**Insert in Q4 — landscape and possible capstone pivot**:
- [SoK: Fully Homomorphic Encryption Accelerators](https://arxiv.org/abs/2212.01713) — a survey covering the GPU/FPGA/ASIC accelerator landscape as a whole, useful for orienting yourself on where GPUs sit relative to custom hardware (ASIC accelerators like CraterLake, ARK, F1 exist specifically because GPUs still leave performance on the table for bootstrapping).
- [BUAA-CI-LAB/Literatures-on-Homomorphic-Encryption](https://github.com/BUAA-CI-LAB/Literatures-on-Homomorphic-Encryption) — a maintained reading list cataloguing accelerator papers (TensorFHE, GME, Cheddar, BTS, and others) by venue and year; use it to find the current state of the art whenever you want to go deeper than this curriculum covers.
- **Capstone alternative**: instead of (or in addition to) the Q4 capstones already listed, implement a CUDA NTT kernel from scratch following the Shivdikar paper's techniques, then benchmark it against OpenFHE's CPU NTT and against PhantomFHE or FIDESlib's GPU implementation. This plays directly to your existing strength and produces a much more concrete, defensible artifact than reading alone would.

---

## Running notes

- **Don't skip the NTT implementation.** It's tempting to treat it as "just an optimized FFT" and move on, but writing it yourself is what makes the modulus-selection constraints in CKKS stop feeling arbitrary.
- **CKKS's approximate nature trips people up.** Keep reminding yourself: you're not getting exact answers back, you're getting answers within a controllable error bound, and that bound is a first-class design parameter, not an afterthought.
- **On Ko's textbook**: it's unusually thorough and worth the investment, but it's unreviewed and proof-dense despite its title — if a derivation there ever conflicts with what a primary-source paper says, trust the paper. Use it to build mechanical understanding fast, not as a citable authority.
- **On the GPU track**: resist the urge to jump straight to CUDA before your CPU-side NTT and CKKS mechanics are solid. GPU code obscures bugs in your understanding of the math behind memory-layout noise — get the algorithm right serially first, then parallelize. Your CUDA fluency will make the *porting* fast; it won't substitute for actually understanding what you're porting.
- **Correctness is not security.** The [Li & Micciancio CKKS attack](https://eprint.iacr.org/2020/1533) in Q3's resources is worth keeping in mind throughout the whole year, not just when you read it: an FHE implementation can run, produce numerically correct approximate answers, pass every functional test, and still leak the secret key the moment decrypted outputs reach an adversary. This is exactly the failure mode that pure library- or code-reading won't teach you to spot — it only becomes visible once you understand the security *model* the code is supposed to satisfy, which is the math's job, not the code's.
- If at any point a paper assumes background you don't have, that's a signal to loop back to Q1 material rather than push through — this field's papers stack assumptions quickly.
- ZK proofs and FHE occasionally share polynomial-commitment machinery (and NTT), so don't be surprised if you bump into ZK papers using near-identical toolkit language even though you're not focusing on it.
