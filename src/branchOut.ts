import { Formula, Transformation } from "./Formula";
import { generateEquivalents } from "./generateEquivalents";
import { formulaToString, printSequence } from "./stringMagic";
import { isFormulaAtomic } from "./properties";

function hash(F: Formula)
{
    return formulaToString(F);
}

// const checked = new Set<string>();

let formulasFound = 0;

// let allFormulas: string[] = [];

export function branchOut(F: Formula, remainingDepth: number, transformations: Transformation[])
{
    formulasFound = 0;
    // checked.clear();
    // allFormulas = [];

    branchOutRecurse(F, remainingDepth, transformations, []);

    console.log(`Total found: ${formulasFound}`);

    // const sorted = allFormulas.sort((a, b) => a.length - b.length);
    // const writeStream = fs.createWriteStream('out.txt');
    // for (const line of sorted)
    //     writeStream.write(line + '\n');
    // writeStream.end();
}

function branchOutRecurse(F: Formula, remainingDepth: number, transformations: Transformation[], sequence: Formula[])
{
    const isAtomic = isFormulaAtomic(F);
    if (isAtomic) printSequence([ ...sequence, F ]);

    formulasFound++;
    
    if (formulasFound % 100000 === 0)
        console.log(`${formulasFound} formulas found...`)

    // allFormulas.push(formulaToString(F));

    if (remainingDepth <= 1)
    {
        return;
    }
    else
    {
        const equivalents = generateEquivalents(F, transformations);

        for (const equivalent of equivalents)
        {
            // if (checked.has(hash(equivalent)))
            // {
            //     skipped++;
            //     continue;
            // }

            branchOutRecurse(equivalent, remainingDepth - 1, transformations, [ ...sequence, F ]);

            // checked.add(hash(equivalent));
        }
    }
}
