import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await entity.items.map((item) => (
      OrderItemModel.update(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        }, 
        {
          where: {
            id: item.id
          }
        }
        )));
        
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: { 
          id: entity.id, 
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: ["items"],
    });
    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(
        (item) =>
        (new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity)
        )
      )
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({include: ["items"]});
    return orderModels.map((orderModel) =>
      new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map(
          (item) =>
          (new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity)
          )
        )
      )
    );
  }
}
