import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntitiy } from './order.entity';

@Entity({ name: 'shipping' })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: ' ' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @OneToOne(() => OrderEntitiy, (order) => order.shippingAddress)
  order: OrderEntitiy;
}
