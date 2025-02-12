import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/dtos/config/prisma.services';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../common/dtos/product.dto';
import { Product } from '@prisma/client';
@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
