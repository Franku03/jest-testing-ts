import { OrderStatus } from "../../src/ejercicio1DDD/domain";
import { OrderTestAPI } from "../testing-apis/OrderTestAPI";

describe('Pruebas en CreditService.domain.service.ts', () => {


    test('debería cambiar el estado de la Orden de PAID a SHIP', async () => {

        const test = new OrderTestAPI();

        await test
                .givenAnOrderIs(OrderStatus.PAID)
                .whenDomainOrderShippmentIsExecuted();

        test.thenOrderStatusShouldBeUpdatedToShipped();

    });

    
    test('debería fallar el cambio de estado de la Orden si la orden no existe', async () => {

        const test = new OrderTestAPI();

        await test
                .givenAnOrderDoesNotExist('non-existing-id')
                .whenDomainOrderShippmentIsExecuted();

        test.thenItShouldFailWith('Order not found');

    });


});