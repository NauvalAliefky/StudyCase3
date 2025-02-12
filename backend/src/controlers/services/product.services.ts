import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/dtos/config/prisma.services';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: Product): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: Product): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
