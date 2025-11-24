import type { IOrderRepository } from "../domain/repositories/IOrderRepository.repository";

import type { OrderId } from "../domain/value-objects/OrderId.type";
import { Money } from "../domain/value-objects/Money";
import { OrderStatus } from "../domain/value-objects/OrderStatus.enum";
import type { ICreditService } from "../domain/domain-services/CreditService.dservice";
import { Order } from "../domain/order.root";


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