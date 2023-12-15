import { IsNotEmpty, IsString } from 'class-validator';
import { UserSigninDto } from './user-signin.dto';

export class UserSignupDto extends UserSigninDto {
  @IsNotEmpty({ message: 'name can not be null' })
  @IsString({ message: 'name should be string' })
  name: string;
}
