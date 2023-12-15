import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/utility/decorator/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntitiy } from './entities/order.entity';
import { AuthenticationGuard } from 'src/utility/guard/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guard/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<OrderEntitiy> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  async findAll(): Promise<OrderEntitiy[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderEntitiy> {
    return await this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.ordersService.update(+id, updateOrderStatusDto, currentUser);
  }

  @Put('cancel/:id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  async cancelled(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.ordersService.cancelled(+id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
