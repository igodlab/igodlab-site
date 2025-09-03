---
Title: A Journey from Haskell to CAtegory Theory
date: 2024-06-03
---

# Down the Haskell Rabbit Hole: From Smart Contracts to Category Theory

When I first started learning Haskell, I had no idea I was about to embark on one of the most mind-bending journeys in my programming career. It all began with a simple goal: I needed to write smart contracts for the Cardano blockchain. Little did I know that this practical necessity would lead me deep into the mathematical foundations of computation itself.

## The Cardano Gateway Drug

Like many developers who stumble into Haskell, I didn't choose it—it chose me. Cardano's smart contract language, Plutus, is built on Haskell, and if you want to build anything meaningful on that blockchain, you better get comfortable with functional programming. I remember staring at my first Haskell function and thinking, "Where are all the variables? Where are my loops? What is this sorcery?"

```haskell
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)
```

No mutable state. No for loops. Just pure functions and recursion. It felt alien coming from imperative languages, but there was something elegant about it that kept pulling me in.

## The Fundamentals That Changed Everything

As I dove deeper into Haskell, guided primarily by the excellent [Haskell Programming from First Principles](https://lorepub.com/product/haskellbook) (seriously, if you're learning Haskell, this book is your bible), I started encountering concepts that challenged everything I thought I knew about programming:

### Purity and Immutability

In Haskell, functions are pure by default. Give a function the same input, and you'll always get the same output. No side effects, no hidden state changes. This isn't just a programming constraint—it's a mathematical guarantee. Pure functions compose beautifully, and reasoning about them becomes almost trivial once you embrace the mindset.

### Strong Static Typing

Haskell's type system isn't just there to catch bugs (though it's incredibly good at that). It's a language for expressing mathematical relationships. Types like `Maybe a`, `Either a b`, and `[a]` aren't just containers—they're mathematical structures with well-defined properties and laws.

### Recursion as First-Class Citizen

Without loops, recursion becomes your bread and butter. But it's not just about replacing `for` with recursive calls. It's about thinking in terms of inductive definitions and structural recursion. Everything becomes a matter of breaking problems down to their base cases.

## Enter the Abstractions: Functors, Applicatives, and Monads

This is where things got really interesting. As I worked through more complex Haskell code, I kept encountering these strange type classes:

### Functors

A Functor is something you can map over. Lists, Maybe values, IO actions—they're all functors. But here's the kicker: this isn't just a programming convenience. It's based on the mathematical concept of functors from category theory.

```haskell
fmap :: Functor f => (a -> b) -> f a -> f b
```

This signature says it all: given a function from `a` to `b`, we can lift it to work on any functor containing `a`s and get a functor containing `b`s.

### Applicative Functors

Then came Applicatives, which let you apply functions inside a context:

```haskell
(<*>) :: Applicative f => f (a -> b) -> f a -> f b
```

Suddenly I could combine multiple "wrapped" values in a clean, composable way.

### Monads: The Infamous Beast

Ah, monads. Every Haskell learner's nemesis and eventual best friend. At first, they seem mysterious and intimidating. But once you grok them, you realize they're just a way to sequence computations in a context:

```haskell
(>>=) :: Monad m => m a -> (a -> m b) -> m b
```

Whether that context is "maybe failing" (Maybe), "potentially multiple results" (lists), or "interacting with the world" (IO), the pattern is the same.

## The Category Theory Connection

Here's where my journey took an unexpected mathematical turn. I started noticing patterns in these abstractions. They weren't just arbitrary programming constructs—they were implementations of concepts from category theory. That's when I discovered [Bartosz Milewski's "Category Theory for Programmers"](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/), and everything clicked.

Category theory, in its simplest form, is the mathematics of composition. A category consists of:
- Objects (think types in Haskell)
- Morphisms (think functions in Haskell) 
- An identity morphism for each object
- Associative composition of morphisms

Sound familiar? That's because Haskell's type system is essentially a category called **Hask**.

### Functors in Category Theory

A functor in category theory is a mapping between categories that preserves structure. In Haskell, our `Functor` type class represents endofunctors in Hask (functors from Hask to itself).

The functor laws aren't just good programming practices—they're mathematical requirements:

1. Identity: `fmap id = id`
2. Composition: `fmap (f . g) = fmap f . fmap g`

### Monads: Monoids in the Category of Endofunctors

This is where things get beautifully abstract. In category theory, a monad is a monoid in the category of endofunctors. What does that even mean?

A monoid has:
- An identity element
- An associative binary operation

For monads:
- Identity: `return` (or `pure`)
- Binary operation: `join` (which flattens `m (m a)` to `m a`)

The `>>=` operation is just a convenience built from `fmap` and `join`:
```haskell
m >>= f = join (fmap f m)
```

### Natural Transformations

Even concepts like `sequence` and `traverse` have category theory roots. They're examples of natural transformations—ways to convert between different functors while preserving structure.

## The Practical Magic

Here's what blew my mind: understanding the category theory foundations didn't just make me better at writing abstract code. It made me better at solving practical problems. When you understand that monads are about sequencing effects, that functors preserve structure, and that applicatives are about combining independent computations, you start seeing these patterns everywhere.

In my Cardano smart contracts, I use `Maybe` to handle partial functions safely, `Either` for error handling, and custom monads to manage blockchain state. But now I understand *why* these abstractions work so well together—they're all instances of the same underlying mathematical structures.

## The Journey Continues

Learning Haskell and its category theory foundations has been like discovering a new language for thinking about computation. It's not just about writing better code (though it does that). It's about understanding the deep mathematical structures that underlie all of programming.

Every time I define a new data type, I ask: "What are its functor laws? Could this be a monad? What mathematical structure am I modeling?" These questions lead to more robust, composable designs.

If you're on a similar journey, my advice is simple: embrace the mathematical foundations. Don't just learn the syntax—understand the theory. The [Haskell Book](https://lorepub.com/product/haskellbook) will teach you the language, and [Bartosz's category theory series](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/) will show you the mathematical beauty underlying it all.

The rabbit hole is deep, but the view from the bottom is incredible.

---

*What started as a necessity for blockchain development became a journey into the mathematical foundations of computation. Sometimes the best discoveries are the ones you never planned to make.*
