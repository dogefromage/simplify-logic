
export enum FormulaTypes
{
    Atomic = 'Atomic',
    Constant = 'Constant',
    Unary = 'Unary',
    Binary = 'Binary',
}

export interface Constant
{
    type: FormulaTypes.Constant,
    value: boolean;
}

export interface Atomic
{
    type: FormulaTypes.Atomic,
    character: string;
}

export enum UnaryOperants
{
    Negation = 'Negation',
}

export interface UnaryP
{
    type: FormulaTypes.Unary,
    inner: Formula;
    operant: UnaryOperants
}

export enum BinaryOperants
{
    Or = 'Or',
    And = 'And',
}

export interface BinaryP
{
    type: FormulaTypes.Binary,
    lhs: Formula;
    rhs: Formula;
    operant: BinaryOperants
}

export type Formula = Constant | UnaryP | BinaryP | Atomic;

// Path

export enum PathWays
{
    Left = 'Left', 
    Right = 'Right', 
    Inward = 'Inward',
}

export type Path = PathWays[];

export type PathMap = 
{
    [ character: string ]: Path;
}

export interface Transformation
{
    from: Formula;
    to: Formula;
}