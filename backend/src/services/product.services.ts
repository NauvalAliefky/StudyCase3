/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../app/api/product/repositories';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  productRepository: any;
  constructor(private readonly ProductRepository: ProductRepository) {}

  async findAll() {
    return this.ProductRepository.findAll();
  }

  async findById(id: number) {
    return this.productRepository.findById(id);
  }

  async create(data: any) {
    return this.ProductRepository.create(data);
  }

  async update(id: number, data: any) {
    return this.ProductRepository.update(id, data);
  }

  async softDelete(id: number, updatedBy: string) {  // Pastikan method ini ada!
    const Product = await this.productRepository.findById(id);
    if (!Product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.softDelete(id, updatedBy);
  }

  async restore(id: number) {
    console.log(`Searching deleted product with ID: ${id}`);
  
    const deletedProducts = await this.findDeleted();
    const Product = deletedProducts.find(emp => emp.id === id);
  
    if (!Product) {
      console.log("Product NOT found in deleted records");
      throw new NotFoundException("Product not found for restoration");
    }
  
    await this.productRepository.restore(id);
  
    const restoredProduct = await this.findById(id);
  
    console.log("Restored Product:", restoredProduct);
    return restoredProduct;
  }  
  
  async findDeleted(): Promise<Product[]> {
    return this.productRepository.findDeleted();
  }  
}