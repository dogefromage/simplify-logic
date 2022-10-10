# simplify-logic

This program simplifies an arbitrary formula written in logic symbols (¬ negation, v or, ^ and, \[A-z\] any character) until the result contains only one of each input character.

```ts

const F = fml`(¬A ^ (¬A v ¬B)) ^ ((¬B ^ ¬A) v C)`;

console.log(formulaToString(F)); // (¬A ^ (¬A v ¬B)) ^ ((¬B ^ ¬A) v C)

branchOut(F, 6, transformations); // ...

```

The program still may contain bugs and if it searches for too long, the Javascript Map will reach its maximum storage potential and the program will crash.
