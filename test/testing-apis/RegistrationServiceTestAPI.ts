import { mock, type MockProxy } from "jest-mock-extended";
import { RegistrationService, type IEmailSender, type ILogger } from "../../src/ejercicio2DDD/RegistrationService.domain";

interface emailRegistrationProps {
    email: string,
    sendWelcomeEmail: boolean,
}

export class RegistrationServiceTestAPI {

    // Mocks
    private readonly mockEmailSender: MockProxy<IEmailSender>;
    private readonly mockLogger: MockProxy<ILogger>;

    // SUT
    private readonly registrationService: RegistrationService;

    // Estado Interno para capturar resultados
    private lastEmailRegistrationSub: emailRegistrationProps | null = null;
    private lastError: Error | null = null;
    private lastRegistrationConfirmation: boolean | null = null;

    constructor(){
        // Inicializamos los mocks
        this.mockEmailSender = mock<IEmailSender>();
        this.mockLogger = mock<ILogger>();

        // Inicizalizamos el SUT
        this.registrationService = new RegistrationService( this.mockEmailSender, this.mockLogger );

    };

    // ARRANGE
    givenAnEmailRegistrationWithWelcomeEmail(email: string): RegistrationServiceTestAPI{

        this.lastEmailRegistrationSub = {
            email,
            sendWelcomeEmail: true
        }

        return this;

    }


    givenAnEmailRegistrationWithoutWelcomeEmail(email: string): RegistrationServiceTestAPI{

        this.lastEmailRegistrationSub = {
            email,
            sendWelcomeEmail: false
        }

        return this;

    }

    givenAnEmailRegistrationWithoutEmail(email: string): RegistrationServiceTestAPI{

        this.lastEmailRegistrationSub = {
            email,
            sendWelcomeEmail: false
        }

        return this;
    }

    // ACT

    whenRegistrationServiceIsExecuted(): RegistrationServiceTestAPI {

        const { email, sendWelcomeEmail } = this.lastEmailRegistrationSub!;

        try {

            this.lastRegistrationConfirmation = this.registrationService.register( email , sendWelcomeEmail );

        } catch (error) {
            
            this.lastError = error as Error;

        }

        return this;

    }

    // ASSERT


    // Aserciones sobre el exito de la operacion
    thenEmailRegisterShouldFail(message: string){

        expect( this.lastError ).toBeDefined();
        expect( this.lastError?.message ).toBe( message ); // "Email requerido"

    }

    thenEmailShouldHaveBeenRegistered(): RegistrationServiceTestAPI {

        expect( this.lastRegistrationConfirmation ).toBeTruthy();

        return this;
    }

    // Aserciones sobre el envio del correo de Bienvenida
    thenWelcomeEmailShouldHaveBeenSent(): RegistrationServiceTestAPI{
        expect( this.mockEmailSender.send ).toHaveBeenCalledWith( this.lastEmailRegistrationSub?.email, "Welcome!", "Thanks for registering.");

        return this;
    }

    
    thenWelcomeEmailShouldNotHaveBeenSent(): RegistrationServiceTestAPI{
        expect( this.mockEmailSender.send ).not.toHaveBeenCalled();

        return this;
    }

    // Aserciones sobre el loggeo de los eventos

    thenEmailRegistrationShouldHaveBeenLogged( message: string ): RegistrationServiceTestAPI{
        expect( this.mockLogger.log ).toHaveBeenCalledWith( message );
        return this;
    }

    thenEmailSendingShoulHaveBeenLogged( message: string ): RegistrationServiceTestAPI{
        expect( this.mockLogger.log ).toHaveBeenCalledWith( message );
        return this
    }

    thenEmailSendingShouldNotHaveBeenLogged(): RegistrationServiceTestAPI{
        // Si no se llama al loggeo de este evento, quiere decir que el Logger solo llama al meotod log una vez, no 2 veces como en el caso donde todo se hace
        expect( this.mockLogger.log ).not.toHaveBeenCalledTimes( 2 ); 
        return this;
    }

   


    
}