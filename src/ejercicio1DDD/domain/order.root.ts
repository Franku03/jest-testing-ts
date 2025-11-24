import { Money } from "./value-objects/Money";
import type { OrderId } from "./value-objects/OrderId.type";
import { OrderStatus } from "./value-objects/OrderStatus.enum";

export class Order {
    constructor(
        public readonly id: OrderId,
        public total: Money,
        public status: OrderStatus
    ) {}

    // Método de negocio: Comportamiento
    public pay(): void {
        if (this.status !== OrderStatus.PENDING) {
        throw new Error('Order already processed');
        }
        this.status = OrderStatus.PAID;
    }

    // Método de negocio: Comportamiento
    public ship(): void {
        // Invariante: No se puede enviar si no está pagado
        if (this.status !== OrderStatus.PAID) {
        throw new Error('Cannot ship an unpaid order');
        }
        this.status = OrderStatus.SHIPPED;
    }
}