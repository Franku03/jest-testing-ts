import { 
    Money, 
    Order, 
    OrderStatus, 
    type ICreditService, 
    type IOrderRepository, 
    type OrderId 
} from "../domain";




// OrderPlacementService (Nuestro SUT: Service de Aplicación)
export class OrderPlacementService {
    
    constructor(
        private orderRepository: IOrderRepository,
        private creditService: ICreditService
    ) {}

    public async placeOrder(userId: string, totalAmount: number): Promise<OrderId> {
        const isCreditValid = await this.creditService.validate(userId);
        
        if (!isCreditValid) {
            throw new Error('Credit check failed for user.');
        }

        // Aquí usamos el Agregado (Order) y la lógica de negocio
        // Usamos el Mother Object internamente en producción o un Factory, pero
        // para simplificar, lo instanciamos aquí:
        const newOrder = new Order(
            `new-${Date.now()}`, // ID simple por ahora
            new Money(totalAmount, 'USD'),
            OrderStatus.PENDING
        );

        await this.orderRepository.save(newOrder);
        return newOrder.id;
    }

}