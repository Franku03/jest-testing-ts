import { Order } from "../../src/ejercicio1DDD/domain/order.root";
import { Money } from "../../src/ejercicio1DDD/domain/value-objects/Money";
import type { OrderId } from "../../src/ejercicio1DDD/domain/value-objects/OrderId.type";
import { OrderStatus } from "../../src/ejercicio1DDD/domain/value-objects/OrderStatus.enum";

export class ObjectMother {


    public static pendingOrder(
        id: OrderId = 'ORDER-001',
        amount: number = 100,
        currency: string = '$', 
        status: OrderStatus = OrderStatus.PENDING
    ): Order {
        const total = new Money ( amount, currency);
        return new Order ( id, total, status);
    }

    public static paidOrder(
        id: OrderId = 'ORDER-002',
        amount: number = 100,
        currency: string = '$', 
        status: OrderStatus = OrderStatus.PAID
    ): Order {
        const total = new Money ( amount, currency);
        return new Order ( id, total, status);
    }

    public static shippedOrder(
        id: OrderId = 'ORDER-003',
        amount: number = 100,
        currency: string = '$', 
        status: OrderStatus = OrderStatus.SHIPPED
    ): Order {
        const total = new Money ( amount, currency);
        return new Order ( id, total, status);
    }


};