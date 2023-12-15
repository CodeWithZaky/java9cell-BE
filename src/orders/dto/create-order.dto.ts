import { ValidateNested } from 'class-validator';
import { CreateShippingDto } from './craate-shipping.dto';
import { Type } from 'class-transformer';
import { OrderedProductsDto } from './ordered-products.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderedProductsDto)
  @ValidateNested()
  orderedProducts: OrderedProductsDto[];
}
