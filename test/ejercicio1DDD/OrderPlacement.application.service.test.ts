import { OrderTestAPI } from "../testing-apis/OrderTestAPI";

describe('Pruebas en OrderPlacement.application.service.ts', () => {

    const userId = 'USER-001'
    const totalAmount = 100;


    test('debería registrar una nueva orden en PENDING y devolver el id de la misma para un usuario dado ', async () => {

        const test = new OrderTestAPI();

        await test  
                .givenAUserRequestWithValidCredits( userId, totalAmount )
                .whenAppOrderPlacementIsExecuted();

        test.thenOrderShouldHaveBeenCreatedAsPending();

    });


    test('NO debería registrar una orden para un usuario dado que no tenga créditos válidos o no que no exista', async () => {

        const test = new OrderTestAPI();

        await test  
                .givenAUserRequestWithNoCredits( userId, totalAmount )
                .whenAppOrderPlacementIsExecuted();

        test.thenItShouldFailWith('Credit check failed for user.');

    });




});