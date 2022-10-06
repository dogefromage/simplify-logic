import { Formula, FormulaTypes } from "./Formula";

export function matchFormulas(abstracted: Formula, concrete: Formula): boolean
{
    /**
     * Important that only abstracted must be atomic, 
     * concrete case could be deeper nested.
     * 
     * For the other FormulaTypes it must be equal
     */

    if (abstracted.type === FormulaTypes.Atomic)
        return true;

    if (abstracted.type === FormulaTypes.Constant &&
        concrete.type === FormulaTypes.Constant)
    {
        return abstracted.value === concrete.value;
    }
        
    if (abstracted.type === FormulaTypes.Unary &&
        concrete.type === FormulaTypes.Unary)
    {
        if (abstracted.operant !== concrete.operant) return false;
        
        return matchFormulas(abstracted.inner, concrete.inner);
    }
        
    if (abstracted.type === FormulaTypes.Binary &&
        concrete.type === FormulaTypes.Binary)
    {
        if (abstracted.operant !== concrete.operant) return false;

        const lhs = matchFormulas(abstracted.lhs, concrete.lhs);
        const rhs = matchFormulas(abstracted.rhs, concrete.rhs);

        return lhs && rhs;
    }

    return false;
}