import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderEntitiy } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntitiy, (order) => order.updatedBy)
  ordersUpdateBy: OrderEntitiy[];

  @OneToMany(() => OrderEntitiy, (order) => order.user)
  orders: OrderEntitiy[];
}
