import { Formula, Transformation } from "./Formula";
import { generateEquivalents } from "./generateEquivalents";
import { formulaToString, printSequence } from "./stringMagic";
import { getFormulaComplexity, isFormulaAtomic } from "./properties";
import fs from 'fs';

function hashFormula(F: Formula)
{
    return formulaToString(F);
}

const visitedNodes = new Map<string, number>();

let formulasFound = 0,
    duplicationsPruned = 0,
    complexSkipped = 0;

let debugLines: string[] = [];

function logInfo()
{
    console.log(`Found ${formulasFound}, dupes pruned ${duplicationsPruned}, too large skipped ${complexSkipped}`);
}

export function branchOut(F: Formula, maxDepth: number, transformations: Transformation[])
{
    formulasFound = duplicationsPruned = complexSkipped = 0;
    visitedNodes.clear();

    debugLines.push(`initial: ${hashFormula(F)}`);

    branchOutRecurse(F, 1, maxDepth, transformations, []);

    logInfo();

    const writeStream = fs.createWriteStream('out.txt');
    for (const line of debugLines)
        writeStream.write(line + '\n');
    writeStream.end();
}

function branchOutRecurse(F: Formula, currentDepth: number, maxDepth: number, 
    transformations: Transformation[], sequence: Formula[])
{
    formulasFound++;
    
    if (formulasFound % 100000 === 0)
        logInfo();

    const isAtomic = isFormulaAtomic(F);
    if (isAtomic) printSequence([ ...sequence, F ]);

    const hashF = hashFormula(F);

    const lastVisited = visitedNodes.get(hashF);
    if (lastVisited != null && lastVisited < currentDepth)
    {
        // debugLines.push(`pruned: ${hashF}, lastDepth: ${lastVisited.nodeDepth}, currentDepth: ${currentDepth}`)
        duplicationsPruned++;
        return;
    }
    
    // debugLines.push(`set: ${hashF}, lastDepth: ${lastVisited}, currentDepth: ${currentDepth}`)
    visitedNodes.set(hashF, currentDepth);

    const complexity = getFormulaComplexity(F);
    if (complexity > 25)
    {
        complexSkipped++;
        return;
    }

    if (currentDepth >= maxDepth)
    {
        return;
    }
    else
    {
        const equivalents = generateEquivalents(F, transformations);

        for (const equivalent of equivalents)
        {
            branchOutRecurse(equivalent, currentDepth + 1, maxDepth, transformations, [ ...sequence, F ]);
        }
    }
}
