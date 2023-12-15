import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSigninDto {
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(5, { message: 'password minimum characters should be 5' })
  password: string;
}
