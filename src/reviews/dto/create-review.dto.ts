import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'product should not be empty' })
  @IsNumber({}, { message: 'product should be a number' })
  productId: number;

  @IsNotEmpty({ message: 'rating should not be empty' })
  @IsNumber({}, { message: 'rating should be a number' })
  rating: number;

  @IsNotEmpty({ message: 'comment should not be empty' })
  @IsString({ message: 'comment should be a string' })
  comment: string;
}
