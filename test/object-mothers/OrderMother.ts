import { Money, type OrderId, OrderStatus } from "../../src/ejercicio1DDD/domain";
import { Order } from "../../src/ejercicio1DDD/domain/Order.aggregate.root";


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