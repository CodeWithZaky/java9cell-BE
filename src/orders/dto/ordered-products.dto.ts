import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'Product id is required' })
  id: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be a positive number' })
  product_quantity: number;
}
