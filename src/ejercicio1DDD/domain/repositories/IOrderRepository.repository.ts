import type { Order } from "../Order.aggregate.root";
import type { OrderId } from "../value-objects/OrderId.type";

export interface IOrderRepository {
    findById(id: OrderId): Promise<Order | null>;
    save(order: Order): Promise<void>;
}