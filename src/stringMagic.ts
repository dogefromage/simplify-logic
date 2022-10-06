import { BinaryOperants, Formula, FormulaTypes, Transformation, UnaryOperants } from "./Formula";

const binaryRegex = /^(¬*(?:\w+|\(.*\)))\s*([v\^])\s*(¬*(?:\w+|\(.*\)))$/;

const binaryOps: { [symbol: string]: BinaryOperants } = 
{
    ['^']: BinaryOperants.And,
    ['v']: BinaryOperants.Or,
}

const unaryRegex = /^(¬)\s*(¬*(?:\w+|\(.*\)))$/;

const unaryOps: { [symbol: string]: UnaryOperants } = 
{
    ['¬']: UnaryOperants.Negation,
}

const atomicRegex = /^([A-z]\w*)$/;

const constantRegex = /^[01]$/;

function trimOuterBrackets(input: string)
{
    input = input.trim();

    let outermostLeft = -1;
    let outermostRight = -1;

    let depth = 0;

    for (let i = 0; i < input.length; i++)
    {
        if (input.charAt(i) === '(')
        {
            if (depth === 0)
                outermostLeft = i;

            depth++;
        }
        else if (input.charAt(i) === ')')
        {
            depth--;
            if (depth === 0)
                outermostRight = i;
        }
    }

    if (depth !== 0) throw new Error(`Brackets not paired correctly: ${input}`);

    if (outermostLeft === 0 &&
        outermostRight === input.length - 1)
    {
        // trim brackets
        const matchBrackets = input.match(/^\((.*)\)$/);
        if (matchBrackets) 
            return matchBrackets[1];
    }

    return input;
}

function fromStringRecursive(input: string): Formula
{
    // trim whitespace
    input = trimOuterBrackets(input);

    const matchBinary = input.match(binaryRegex);
    if (matchBinary)
    {
        const lhs = fromStringRecursive(matchBinary[1]);
        const rhs = fromStringRecursive(matchBinary[3]);
        const operant = binaryOps[matchBinary[2]];

        if (!operant || !lhs || !rhs)
            throw new Error(`Cannot construct formula: ${input}`);

        const formula: Formula = 
        {
            type: FormulaTypes.Binary,
            operant,
            lhs,
            rhs,
        }

        return formula;
    }

    const matchUnary = input.match(unaryRegex);
    if (matchUnary)
    {
        const operant = unaryOps[matchUnary[1]];
        const inner = fromStringRecursive(matchUnary[2]);

        if (!operant || !inner)
            throw new Error(`Cannot construct formula: ${input}`);

        const formula: Formula = 
        {
            type: FormulaTypes.Unary,
            operant,
            inner,
        }

        return formula;
    }

    const matchConstant = input.match(constantRegex);
    if (matchConstant)
    {
        const isTaut = matchConstant[0] === '1';
        const isUnsat = matchConstant[0] === '0';

        if (!isTaut && !isUnsat)
            throw new Error(`Value not recognized: ${input}`);
        
        const formula: Formula = 
        {
            type: FormulaTypes.Constant,
            value: isTaut,
        }

        return formula;
    }

    const matchAtomic = input.match(atomicRegex);
    if (matchAtomic)
    {
        const character = matchAtomic[1];

        const formula: Formula = 
        {
            type: FormulaTypes.Atomic,
            character,
        }

        return formula;
    }

    throw new Error(`Symbol not recognized: ${input}`);
}

export function fml(input: TemplateStringsArray)
{
    return fromStringRecursive(input[0]);
}

export function implication(from: string, to: string)
{
    const transformation: Transformation =
    {
        from: fromStringRecursive(from),
        to: fromStringRecursive(to),
    }

    return transformation;
}

export function equivalency(F: string, G: string)
{
    return [
        implication(F, G),
        implication(G, F),
    ]
}

function formulaToStringRecurse(formula: Formula): string
{
    if (formula.type === FormulaTypes.Atomic)
        return formula.character;

    if (formula.type === FormulaTypes.Unary)
    {
        const operant = Object.entries(unaryOps)
            .find(([ char, operant ]) => operant === formula.operant)?.[0]!;

        return `${operant}${formulaToStringRecurse(formula.inner)}`;
    }

    if (formula.type === FormulaTypes.Binary)
    {
        const operant = Object.entries(binaryOps)
            .find(([ char, operant ]) => operant === formula.operant)?.[0]!;

        let lhs = formulaToStringRecurse(formula.lhs);
        let rhs = formulaToStringRecurse(formula.rhs);
        
        return `(${lhs} ${operant} ${rhs})`
    }

    if (formula.type === FormulaTypes.Constant)
    {
        return formula.value ? '1' : '0';
    }

    throw new Error(`Operation not found`);
}

export function formulaToString(formula: Formula): string
{
    let output = formulaToStringRecurse(formula);

    return trimOuterBrackets(output);
}

export function printSequence(sequence: Formula[])
{
    console.log(`\nSequence of ${sequence.length} steps:`)
    for (let i = 0; i < sequence.length; i++)
    {
        console.log(`${i + 1}.  === ${formulaToString(sequence[i])}`)
    }
}