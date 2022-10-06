
import { branchOut } from "./branchOut";
import { Transformation } from "./Formula";
import { equivalency, fml, formulaToString, implication } from "./stringMagic";

const transformations: Transformation[] =
[
    // 0
    implication('F ^ ¬F', '0'),
    implication('F ^ 0', '0'),
    implication('F v 0', 'F'),
    implication('F v ¬F', '1'),
    implication('F ^ 1', 'F'),
    implication('F v 1', '1'),

    // 6
    implication('A ^ A', 'A'),
    implication('A v A', 'A'),

    // 8
    implication('A ^ B', 'B ^ A'),

    // 9
    ...equivalency('(A ^ B) ^ C', 'A ^ (B ^ C)'),
    ...equivalency('(A v B) v C', 'A v (B v C)'),

    // 13
    implication('A ^ (A v B)', 'A'),
    implication('A v (A ^ B)', 'A'),

    // 15
    ...equivalency('A ^ (B v C)', '(A ^ B) v (A ^ C)'),
    ...equivalency('A v (B ^ C)', '(A v B) ^ (A v C)'),

    // 19
    implication('¬¬A', 'A'),

    // 20
    ...equivalency('¬(A ^ B)', '¬A v ¬B'),
    ...equivalency('¬(A v B)', '¬A ^ ¬B'),

    // total 24
]

// const F = fml`((¬A v ¬B) ^ ¬A) ^ ((¬B ^ ¬A) v C)`;
// const F = fml`(¬A ^ (¬A v ¬B)) ^ ((¬B ^ ¬A) v C)`;
// const F = fml`¬A ^ ((¬B ^ ¬A) v C)`;
// const F = fml`(¬A ^ (¬B ^ ¬A)) v (¬A ^ C)`;
// const F = fml`(¬A ^ (¬A ^ ¬B)) v (¬A ^ C)`;
// const F = fml`((¬A ^ ¬A) ^ ¬B) v (¬A ^ C)`;
// const F = fml`(¬A ^ ¬B) v (¬A ^ C)`;
// console.log(isFormulaAtomic(fml`¬A ^ (¬B v C)`));

const F = fml`(¬A ^ (¬A v ¬B)) ^ ((¬B ^ ¬A) v C)`;
console.log(formulaToString(F));

// const equivalencies = generateEquivalents(F, transformations);
// equivalencies.forEach(e => console.log('=== ' + formulaToString(e)));

branchOut(F, 7, transformations);


