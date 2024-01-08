import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'Product id is required' })
  id: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be a positive number' })
  product_quantity: number;

  @IsNotEmpty({ message: 'Courier is required' })
  @IsString({ message: 'Courier must be a string' })
  courier: string;

  @IsNotEmpty({ message: 'payment method id is required' })
  @IsString({ message: 'Payment method must be a string' })
  payment_method: string;
}
