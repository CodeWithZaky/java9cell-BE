import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title can not be empty' })
  @IsString({ message: 'title should be a string' })
  title: string;

  @IsNotEmpty({ message: 'description can not be empty' })
  @IsString({ message: 'description should be a string' })
  description: string;

  @IsNotEmpty({ message: 'price can not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be a number and has max decimal precision of 2' },
  )
  @IsPositive({ message: 'price should be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'stock should not be empty' })
  @IsNumber({}, { message: 'stock should be a number' })
  @Min(0, { message: 'stock can not be negative' })
  stock: number;

  @IsNotEmpty({ message: 'images should not be empty' })
  @IsArray({ message: 'images should be in array format' })
  images: string[];

  @IsNotEmpty({ message: 'category should not be empty' })
  @IsNumber({}, { message: 'category should be a number' })
  categoryId: number;
}
