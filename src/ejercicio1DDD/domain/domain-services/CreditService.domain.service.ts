export interface ICreditService {
    
    // Simula una llamada a una API externa para validar crédito
    validate(userId: string): Promise<boolean>;

};