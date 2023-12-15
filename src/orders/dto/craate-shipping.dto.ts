import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @IsNotEmpty({ message: 'PostCode is required' })
  @IsString({ message: 'PostCode must be a string' })
  postCode: string;

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  state: string;

  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country: string;
}
