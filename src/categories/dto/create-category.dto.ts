import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'title can not be empty' })
  @IsString({ message: 'title should be a string' })
  title: string;

  @IsNotEmpty({ message: 'description can not be empty' })
  @IsString({ message: 'description should be a string' })
  description: string;
}
