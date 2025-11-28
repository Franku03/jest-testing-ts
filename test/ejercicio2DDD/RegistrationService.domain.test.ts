import { RegistrationServiceTestAPI } from "../testing-apis/RegistrationServiceTestAPI"

describe('Pruebas en RegistrationService.domain.ts', () => {

    const EMAIL = 'test@gmail.com'

    test('deberia registrar el email de manera exitosa, loggear el email registrado y enviar un correo de bienvenida', () => {

        const test = new RegistrationServiceTestAPI();

        test
            .givenAnEmailRegistrationWithWelcomeEmail( EMAIL )

            .whenRegistrationServiceIsExecuted()

            .thenEmailRegistrationShouldHaveBeenLogged(`User registered: ${EMAIL}`)
            .thenWelcomeEmailShouldHaveBeenSent()
            .thenEmailSendingShoulHaveBeenLogged("Welcome email sent")
            .thenEmailShouldHaveBeenRegistered();

    })


    test('deberia registrar el email de manera exitosa, loggear el email registrado pero NO enviar un correo de bienvenida ni loggear ese evento', () => {

        const test = new RegistrationServiceTestAPI();

        test
            .givenAnEmailRegistrationWithoutWelcomeEmail( EMAIL )

            .whenRegistrationServiceIsExecuted()

            .thenEmailRegistrationShouldHaveBeenLogged(`User registered: ${EMAIL}`)
            .thenWelcomeEmailShouldNotHaveBeenSent()
            .thenEmailSendingShouldNotHaveBeenLogged()
            .thenEmailShouldHaveBeenRegistered();
    })


    
    test('deberia fallar el registro de email dado un email vacío', () => {

        const test = new RegistrationServiceTestAPI();

        test
            .givenAnEmailRegistrationWithoutEmail('')

            .whenRegistrationServiceIsExecuted()

            .thenEmailRegisterShouldFail("Email requerido");

    })




})