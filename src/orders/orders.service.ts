import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntitiy } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntitiy)
    private readonly ordersRepository: Repository<OrderEntitiy>,
    @InjectRepository(OrdersProductsEntity)
    private readonly ordersProductsRepository: Repository<OrdersProductsEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntitiy> {
    const shiipingEntity = new ShippingEntity();
    Object.assign(shiipingEntity, createOrderDto.shippingAddress);
    const orderEntity = new OrderEntitiy();
    orderEntity.shippingAddress = shiipingEntity;
    orderEntity.user = currentUser;

    const orderTbl = await this.ordersRepository.save(orderEntity);

    let opEntity: {
      order: OrderEntitiy;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
      courier: string;
      payment_method: string;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      const courier = createOrderDto.orderedProducts[i].courier;
      const payment_method = createOrderDto.orderedProducts[i].payment_method;

      opEntity.push({
        order,
        product: product,
        product_quantity,
        product_unit_price,
        courier,
        payment_method,
      });
    }

    const op = await this.ordersProductsRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<OrderEntitiy[]> {
    return await this.ordersRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<OrderEntitiy> {
    return await this.ordersRepository.findOne({
      where: {
        id,
      },
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  async findOneByProductId(id: number) {
    return await this.ordersProductsRepository.findOne({
      relations: { product: true },
      where: {
        product: {
          id: id,
        },
      },
    });
  }
  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);

    if (!order) throw new NotFoundException("Order doesn't exist");

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }

    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status != OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivary before shipped !!!`);
    }

    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.ordersRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('order not found');

    if (order.status === OrderStatus.CANCELED) {
      return order;
    }

    order.status = OrderStatus.CANCELED;
    order.updatedBy = currentUser;
    order = await this.ordersRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELED);
    return order;
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntitiy, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
}
