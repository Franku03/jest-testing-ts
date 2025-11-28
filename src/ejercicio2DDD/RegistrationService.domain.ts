// --- Interfaces ---

export interface IEmailSender {
    // En TS los métodos suelen empezar con minúscula (camelCase)
    send(to: string, subject: string, body: string): void;
}

export interface ILogger {
    log(message: string): void;
}

// --- Servicio ---

export class RegistrationService {
    // Definición de las dependencias privadas y de solo lectura
    // Inyección de dependencias a través del constructor
    constructor(
        private readonly _email: IEmailSender, 
        private readonly _logger: ILogger
    ) {}

    public register(email: string, sendWelcomeEmail: boolean): boolean {
        // En TS no existe string.IsNullOrWhiteSpace, 
        // validamos si es null/undefined o si al quitar espacios está vacío.
        if (!email || email.trim().length === 0) {
            // En JS/TS lanzamos un Error genérico (no hay ArgumentException nativo)
            throw new Error("Email requerido");
        }

        this._logger.log(`User registered: ${email}`); 

        if (sendWelcomeEmail) {
            this._email.send(email, "Welcome!", "Thanks for registering.");
            this._logger.log("Welcome email sent");
        }

        return true;
    }
}