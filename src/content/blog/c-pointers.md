---
title: "Pointers Are Not Scary"
description: "A pointer is a value that happens to be an address. Once that clicks, the syntax stops fighting you."
date: 2026-08-24
series: c-programming
seriesOrder: 2
tags: ["c", "pointers", "systems"]
cover: ../../assets/covers/c-pointers.png
coverAlt: "Abstract cool-toned gradient with concentric rings"
---

Pointers have a reputation they do not deserve. The concept is simple: a pointer is a variable whose value is the address of another object. The difficulty is almost entirely in C's declaration syntax, which reads inside-out and was a mistake.

## Declaration follows use

The rule that unlocks C declarations is that a declaration describes the expression that yields the base type.

```c
int *p;        // *p is an int, so p is a pointer to int
int *arr[10];  // *arr[i] is an int, so arr is an array of 10 pointers
int (*fp)(void);  // (*fp)() is an int, so fp is a pointer to a function
```

Read them from the identifier outward, respecting parentheses. Every confusing C declaration you will ever meet yields to this.

## Pointer arithmetic is typed

Adding one to a pointer does not add one byte. It advances by one *object*.

```c
int a[4] = {10, 20, 30, 40};
int *p = a;
p + 1;    // address of a[1] — four bytes further on a typical platform
```

This is why `void *` cannot be dereferenced or incremented: without a type, the compiler does not know the stride.

## The null pointer

`NULL` is a valid pointer value that is guaranteed not to point at any object. Dereferencing it is undefined behaviour, which on most systems means a segfault — one of C's genuinely helpful failure modes, because it fails loudly and immediately.

Always check the return value of anything that can fail:

```c
FILE *f = fopen("data.txt", "r");
if (!f) {
    perror("fopen");
    return 1;
}
```

## Where this goes next

Once pointers are comfortable, arrays stop being a separate concept — arrays decay to pointers in almost every expression, and the two are close enough that the distinction only matters in a handful of places. Those places are the subject of the next part.
