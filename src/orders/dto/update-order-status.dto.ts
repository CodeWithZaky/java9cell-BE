import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enums';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  status: OrderStatus;
}
