import { attemptTransformation } from "./attemptTransformation";
import { Formula, FormulaTypes, Path, PathWays, Transformation } from "./Formula";
import { copyFormula, setSubFormula } from "./properties";

function genRecurse(root: Formula, sub: Formula, path: Path, newFormulae: Formula[], transformations: Transformation[])
{
    // depth first search

    if (sub.type === FormulaTypes.Atomic) 
        return;
        
    if (sub.type === FormulaTypes.Constant) 
        return;

    if (sub.type === FormulaTypes.Unary)
    {
        genRecurse(root, sub.inner, [ ...path, PathWays.Inward ], newFormulae, transformations);
    }
    else if (sub.type === FormulaTypes.Binary)
    {
        genRecurse(root, sub.lhs, [ ...path, PathWays.Left ], newFormulae, transformations);
        genRecurse(root, sub.rhs, [ ...path, PathWays.Right ], newFormulae, transformations);
    }

    // apply transformation and push to newFormulae

    for (const t of transformations)
    {
        const transformed = attemptTransformation(sub, t);
        if (!transformed) continue;

        // console.log(`Lemma: ` + formulaToString(t.from) + ' = ' + formulaToString(t.to));
        // console.log(formulaToString(sub) + ' = ' + formulaToString(transformed));
        // console.log();

        const rootCopy = copyFormula(root);
        newFormulae.push(setSubFormula(rootCopy, path, transformed));
    }
}

export function generateEquivalents(formula: Formula, transformations: Transformation[])
{
    const newFormulae: Formula[] = [];
    genRecurse(formula, formula, [], newFormulae, transformations);
    return newFormulae;
}