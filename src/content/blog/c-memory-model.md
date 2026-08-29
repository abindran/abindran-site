---
title: "The C Memory Model"
description: "Stack, heap, and static storage — what actually lives where, and why it matters before you touch a single pointer."
date: 2026-08-20
series: c-programming
seriesOrder: 1
tags: ["c", "memory", "systems"]
cover: ../../assets/covers/c-memory-model.png
coverAlt: "Abstract warm-toned gradient with concentric rings"
---

Before pointers make any sense, you need a mental model of where things live. C gives you three storage durations, and almost every confusing bug in a beginner C program comes from misunderstanding which one you are in.

## Static storage

Variables declared at file scope, or with `static`, exist for the entire lifetime of the program. They are allocated once, before `main` runs, and zero-initialised unless you say otherwise.

```c
static int counter = 0;   // exists from program start to program exit

void increment(void) {
    counter++;            // same object on every call
}
```

The important property is that the address never changes. You can safely return a pointer to a static object — a fact that is occasionally useful and frequently abused.

## Automatic storage — the stack

Local variables inside a function have *automatic* storage duration. They come into existence when the block is entered and cease to exist when it exits.

```c
int *broken(void) {
    int x = 42;
    return &x;            // x dies here; the pointer is now garbage
}
```

This is the single most common beginner mistake in C, and it is worth staring at. The code compiles. It may even appear to work, because the memory has not been reused *yet*. That is what makes it dangerous: undefined behaviour is not the same as a crash.

## Allocated storage — the heap

When you need an object to outlive the function that created it, you allocate it explicitly.

```c
int *working(void) {
    int *x = malloc(sizeof *x);
    if (!x) return NULL;      // malloc can fail; check it
    *x = 42;
    return x;                 // caller now owns this, and must free it
}
```

Note `sizeof *x` rather than `sizeof(int)`. If the type of `x` ever changes, the allocation size follows automatically. This is a small habit that eliminates an entire class of bug.

## What to take away

Every object in a C program has a storage duration, and that duration determines when the object is valid. Pointers do not extend lifetimes — they only refer to them. Almost everything in the next part follows from that one sentence.
