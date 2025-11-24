export class Money {
    
    constructor(
        public readonly amount: number, 
        public readonly currency: string
    ) {}
// Lógica de VO: Inmutabilidad y operaciones
    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}