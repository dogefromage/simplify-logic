import {
    areFormulaesEqual,
    copyFormula,
    findAtomics,
    getSubFormula,
    setSubFormula
    } from './properties';
import { Formula, Path, Transformation } from './Formula';
import { matchFormulas } from './matchFormulas';

interface AtomicOccurence
{
    from: Path[];
    to: Path[];
}

function getAtomicsMappings({ from, to }: Transformation)
{
    const fromAtomics = findAtomics(from);
    const toAtomics = findAtomics(to);

    const map = new Map<string, AtomicOccurence>();

    for (const fromAtomic of fromAtomics)
    {
        const entry = map.get(fromAtomic.character) || { from: [], to: [] };
        map.set(fromAtomic.character, entry);

        entry.from.push(fromAtomic.path);
    }
    
    for (const toAtomic of toAtomics)
    {
        const entry = map.get(toAtomic.character) || { from: [], to: [] };
        map.set(toAtomic.character, entry);

        entry.to.push(toAtomic.path);
    }

    return map;
}

export function attemptTransformation(root: Formula, transformation: Transformation)
{
    // match form
    const theyMatch = matchFormulas(transformation.from, root);
    if (!theyMatch) return undefined;

    // swap atomics
    const mappings = getAtomicsMappings(transformation);

    let toCopy = copyFormula(transformation.to);

    let hasChanged = false;

    for (const [ character, atomicMapping ] of mappings)
    {
        if (!atomicMapping.from.length)
            continue;

        if (atomicMapping.from.length > 1)
        {
            for (let i = 0; i < atomicMapping.from.length - 1; i++)
            {
                const A = getSubFormula(root, atomicMapping.from[i]);
                const B = getSubFormula(root, atomicMapping.from[i + 1]);

                if (!A || !B || !areFormulaesEqual(A, B))
                    return undefined; // formula does not qualify for transformation
            }
        }

        const atomicSubFormula = getSubFormula(root, atomicMapping.from[0]);
        if (!atomicSubFormula)
            throw new Error(`Sub not found`);

        for (const toPath of atomicMapping.to)
        {
            toCopy = setSubFormula(toCopy, toPath, atomicSubFormula);
            hasChanged = true;
        }
    }

    if (!hasChanged) return undefined;

    return toCopy;
}