/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductController } from './routes';
import { ProductService } from '../../../services/product.services';
import { ProductRepository } from './repositories';
import { PrismaService } from '../../../lib/prisma';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}