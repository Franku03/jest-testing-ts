import type { IOrderRepository } from "../repositories";
import type { OrderId } from "../value-objects";


export class ShipmentService {

    constructor(
        private orderRepository: IOrderRepository
    ) {}

    public async shipOrder(orderId: OrderId): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        // La lógica de negocio reside en el Agregado, el servicio solo orquesta
        order.ship();
        // Persistir el nuevo estado
        await this.orderRepository.save(order);
    }
    
}