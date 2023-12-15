import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSigninDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignupDto: UserSignupDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignupDto.email);
    if (userExists) {
      throw new BadRequestException('email is not available');
    }
    userSignupDto.password = await hash(userSignupDto.password, 10);
    let user = this.usersRepository.create(userSignupDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSigninDto.email })
      .getOne();
    if (!userExists) {
      throw new BadRequestException('email or password is not correct');
    }
    const isPasswordValid = await compare(
      userSigninDto.password,
      userExists.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('email or password is not correct');
    }
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email } });
  }
  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }
}
