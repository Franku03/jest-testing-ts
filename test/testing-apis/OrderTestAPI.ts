import { mock, type MockProxy } from "jest-mock-extended";

import { OrderMother } from "../object-mothers/OrderMother";

import { OrderStatus, ShipmentService, type ICreditService, type IOrderRepository, type Order, type OrderId } from "../../src/ejercicio1DDD/domain";
import { OrderPlacementService } from "../../src/ejercicio1DDD/application";

interface UserRequest {
    userId: string,
    totalAmount: number
};

export class OrderTestAPI {

    // ? Mocks Ocultos
    private repoMock: MockProxy<IOrderRepository>;
    private creditApiMock: MockProxy<ICreditService>;

    // ? El SUT (Domain Service) y el SUT (Application Service)
    private domainService: ShipmentService;
    private appService: OrderPlacementService;

    // ? Estado interno para capturar resultados
    private lastError: Error | null = null;
    private lastOrderState: Order | null = null;

    // ? Para capturar los argumentos del Application Service
    private lastUserRequest: UserRequest | null = null;
    private lastIdResolved: string | null = null;


    constructor(){
        // Inicializamos mocks
        this.repoMock = mock<IOrderRepository>();
        this.creditApiMock = mock<ICreditService>();

        // Inicializacmos los SUTs
        this.domainService = new ShipmentService( this.repoMock );
        this.appService = new OrderPlacementService( this.repoMock, this.creditApiMock );

    }

    // * ARRANGE / GIVEN - Configuracion de la prueba

    // ? Para las pruebas del Domain Service

    public givenAnOrderIs(status: OrderStatus): this {
        switch( status ){
            case (OrderStatus.PENDING):
                this.lastOrderState = OrderMother.pendingOrder();
                break;
            case (OrderStatus.PAID):
                this.lastOrderState = OrderMother.paidOrder();
                break;

            case (OrderStatus.SHIPPED):
                this.lastOrderState = OrderMother.shippedOrder();
                break;
            default:
                throw Error('Must submit an OrderStatus');
        };

        // Configuramos el valor de retorno del mock del metodo findById del repositorio el cual es utilizado por el domain Service
        this.repoMock.findById.calledWith( this.lastOrderState.id ).mockResolvedValue( this.lastOrderState );

        return this
    };

    public givenAnOrder( order: Order){
        this.lastOrderState = order;
        return this 
    };

    public givenAnOrderThatDoesNotExist( orderId: OrderId ): this {

        // Configuramos el valor de retorno del mock del metodo findById del repositorio el cual es utilizado por el domain Service
        this.repoMock.findById.calledWith( orderId ).mockResolvedValue( null );

        return this;

    };

    // ? Para las pruebas del Application Service

    public givenAUserRequestWithValidCredits( userId: string, totalAmount: number ): this {

        // Configuramos el valor de retorno del mock del metodo findById del repositorio el cual es utilizado por el domain Service
        this.lastUserRequest = { userId, totalAmount };

        this.creditApiMock.validate.calledWith( this.lastUserRequest.userId ).mockResolvedValue( true );

        return this;

    };


    
    public givenAUserRequestWithNoCredits( userId: string, totalAmount: number ): this {

        // Configuramos el valor de retorno del mock del metodo findById del repositorio el cual es utilizado por el domain Service
        this.lastUserRequest = { userId, totalAmount };

        this.creditApiMock.validate.calledWith( this.lastUserRequest.userId ).mockResolvedValue( false );

        return this;

    };

    // * ACT / WHEN - Ejecucion de la prueba

    // ? Actuar sobre Servicio de Dominio

    public async whenDomainOrderShippmentIsExecuted(
        // orderId: OrderId
    ): Promise<this> {

        try {
            if( !this.lastOrderState ){
                await this.domainService.shipOrder( 'non-existing-id' );
            }else{
                await this.domainService.shipOrder( this.lastOrderState!.id );
            }
        } catch (error) {
            this.lastError = error as Error;
        };

        return this;

    };

    // ? Actuar sobre Servicio de Aplicacion

    public async whenAppOrderPlacementIsExecuted(

    ): Promise<this> {

        const { userId, totalAmount } = this.lastUserRequest!;

        try {

            this.lastIdResolved = await this.appService.placeOrder( userId, totalAmount );


        } catch (error) {

            this.lastError = error as Error;

        };

        return this;

    }


    // * ASSERT / THEN - Verificaciones / Aserciones

    // ¿ Aserciones para fallos en servicios

    public thenItShouldFailWith( message: string ): void {

        // Verificamos el estado de error que debimos obtener del catch del Error en el WHEN
        expect( this.lastError ).toBeDefined();
        expect( this.lastError?.message ).toBe( message );
        this.thenRepositoryShouldNotBeSaved();
    };

    private thenRepositoryShouldNotBeSaved(): void {
        // Verificamos que efectivamente el metodo save del repositorio no fue llamado dado que al lanzar el error la ejecucion del metodo del domain service se detuvo
        expect( this.repoMock.save ).not.toHaveBeenCalled();
    };


    // ¿ Aserciones servicio de dominio

    public thenOrderStatusShouldBeUpdatedToShipped(): void {
        // Verificamos que el metodo fue llamado una vez en caso de exito y luego verificamos si fue llamado con el argumento esperado, en este caso la orden como SHIPPED

        expect( this.repoMock.save ).toHaveBeenCalledTimes( 1 );
        expect( this.repoMock.save ).toHaveBeenCalledWith( this.lastOrderState );

        const savedOrder = this.repoMock.save.mock.calls[0]![0];
        expect( savedOrder.status ).toBe( OrderStatus.SHIPPED );

    }

    // ¿ Aserciones servicio de aplicación

    public thenOrderShouldHaveBeenCreatedAsPending() {

        // Verificamos que el metodo fue llamado una vez en caso de exito y luego verificamos si fue llamado con el argumento esperado, en este caso la orden como PENDING

        expect( this.creditApiMock.validate ).toHaveBeenCalledTimes( 1 );
        expect( this.creditApiMock.validate ).toHaveBeenCalledWith( this.lastUserRequest?.userId );

        const savedOrder = this.repoMock.save.mock.calls[0]![0];

        // Capturamos el id de la orden creada en el when, y verificamos que el id retornado sea el mismo que el de la orden con que se llamó al método save del repositorio
        expect( this.lastIdResolved ).toEqual( savedOrder.id );
        expect( savedOrder.status ).toBe( OrderStatus.PENDING );

    }



}
