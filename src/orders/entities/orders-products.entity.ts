import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntitiy } from './order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity({ name: 'orders_products' })
export class OrdersProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  product_quantity: number;

  @ManyToOne(() => OrderEntitiy, (order) => order.products)
  order: OrderEntitiy;

  @ManyToOne(() => ProductEntity, (product) => product.products, {
    cascade: true,
  })
  product: ProductEntity;
}
