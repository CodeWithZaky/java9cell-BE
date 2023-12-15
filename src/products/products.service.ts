import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enums';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAll(query: any): Promise<{
    products: any[];
    totalProducts;
    limit;
  }> {
    let filterTotalProduct: number;
    let limit: number;

    if (!query.limit) {
      limit = 100;
    } else {
      limit = query.limit;
    }
    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'reviews')
      .addSelect([
        'COUNT(reviews.id) as reviewCount',
        'AVG(reviews.rating)::numeric(10,2) as avgRating',
      ])
      .groupBy('product.id, category.id');
    const totalProducts = await queryBuilder.getCount();

    if (query.search) {
      queryBuilder.andWhere('product.title LIKE :title', {
        title: `%${query.search}%`,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('category.id=:id', {
        id: query.category,
      });
    }

    if (query.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    if (query.minRating) {
      queryBuilder.andHaving('AVG(reviews.rating) >= :minRating', {
        minRating: query.minRating,
      });
    }

    if (query.maxRating) {
      queryBuilder.andHaving('AVG(reviews.rating) <= :maxRating', {
        maxRating: query.maxRating,
      });
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    queryBuilder.limit(limit);
    const products = await queryBuilder.getRawMany();

    return { products, totalProducts, limit };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        addedBy: true,
        category: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        +updateProductDto.categoryId,
      );
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    // const order = await this.orderService.findOneByProductId(id);
    // if (order) {
    //   throw new BadRequestException('Product in order cannot be deleted');
    // }
    return await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
