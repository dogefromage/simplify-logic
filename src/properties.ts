import _ from 'lodash';
import { Path, Formula, FormulaTypes, PathWays } from './Formula';

export function copyFormula(formula: Formula)
{
    return _.cloneDeep(formula);
}

function findAtomicsRecurse(formula: Formula, currentPath: Path, paths: { path: Path, character: string }[])
{
    if (formula.type === FormulaTypes.Atomic)
    {
        paths.push({
            path: currentPath,
            character: formula.character,
        });
        return;
    }
        
    if (formula.type === FormulaTypes.Unary)
    {
        findAtomicsRecurse(formula.inner, [ ...currentPath, PathWays.Inward ], paths);
        return;
    }

    if (formula.type === FormulaTypes.Binary)
    {
        findAtomicsRecurse(formula.lhs, [ ...currentPath, PathWays.Left ], paths);
        findAtomicsRecurse(formula.rhs, [ ...currentPath, PathWays.Right ], paths);
        return;
    }
}

export function findAtomics(formula: Formula)
{
    const paths: { path: Path, character: string }[] = [];
    findAtomicsRecurse(formula, [], paths);
    return paths;
}

export function getSubFormula(root: Formula, path: Path)
{
    let current = root;

    let i = 0;
    while (i < path.length)
    {
        const way = path[i];
        
        if (way === PathWays.Inward)
        {
            if (current.type !== FormulaTypes.Unary)
                return undefined;
            
            current = current.inner;
        }
        else if (way === PathWays.Left)
        {
            if (current.type !== FormulaTypes.Binary)
                return undefined;
            current = current.lhs;
        }
        else if (way === PathWays.Right)
        {
            if (current.type !== FormulaTypes.Binary)
                return undefined;
            current = current.rhs;
        }

        i++;
    }

    return current;
}

export function setSubFormula(root: Formula, path: Path, sub: Formula)
{
    if (!path.length) return sub;

    const beforeSub = getSubFormula(root, path.slice(0, -1));
    if (!beforeSub)
        throw new Error(`Path invalid`);

    const lastWay = path.at(-1);
        
    if (lastWay === PathWays.Inward)
    {
        if (beforeSub.type !== FormulaTypes.Unary)
            throw new Error(`Path invalid`);
        
        beforeSub.inner = sub;
    }
    else if (lastWay === PathWays.Left)
    {
        if (beforeSub.type !== FormulaTypes.Binary)
            throw new Error(`Path invalid`);

        beforeSub.lhs = sub;
    }
    else if (lastWay === PathWays.Right)
    {
        if (beforeSub.type !== FormulaTypes.Binary)
            throw new Error(`Path invalid`);
        beforeSub.rhs = sub;
    }

    return root;
}

export function areFormulaesEqual(A: Formula, B: Formula): boolean
{
    if (A.type === FormulaTypes.Atomic &&
        B.type === FormulaTypes.Atomic)
    {
        return A.character === B.character;
    }

    if (A.type === FormulaTypes.Constant &&
        B.type === FormulaTypes.Constant)
    {
        return A.value === B.value;
    }
        
    if (A.type === FormulaTypes.Unary &&
        B.type === FormulaTypes.Unary)
    {
        if (A.operant !== B.operant) return false;

        return areFormulaesEqual(A.inner, B.inner);
    }
        
    if (A.type === FormulaTypes.Binary &&
        B.type === FormulaTypes.Binary)
    {
        if (A.operant !== B.operant) return false;
        
        const lhs = areFormulaesEqual(A.lhs, B.lhs);
        const rhs = areFormulaesEqual(A.rhs, B.rhs);

        return lhs && rhs;
    }

    return false;
}

export function isFormulaAtomic(F: Formula)
{
    const atomicsFound = findAtomics(F);

    const chars = new Set<string>();

    for (const foundAtomic of atomicsFound)
    {
        if (chars.has(foundAtomic.character)) return false;

        chars.add(foundAtomic.character);
    }

    return true;
}