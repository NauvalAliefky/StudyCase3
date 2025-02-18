/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from '../../../services/product.services';
import {
  CreateProductDto,
  UpdateProductDto,
  SoftDeleteProductDto,
} from '../../api/product/dto';
import { ApiResponse } from '../../../utils/api.respon';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const products = await this.productService.findAll();
    console.log('Fetching all products...');
    return ApiResponse.success('Products retrieved successfully', products);
  }

  @Get('deleted')
  @HttpCode(200)
  async getDeletedProducts() {
    try {
      const deletedProducts = await this.productService.findDeleted();
      console.log('Deleted Products:', deletedProducts);
      return ApiResponse.success('Deleted products retrieved', deletedProducts);
    } catch (error) {
      console.error('Error fetching deleted products:', error);
      throw new InternalServerErrorException('Failed to fetch deleted products');
    }
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateProductDto) {
    if (!data.name || !data.category) {
      throw new BadRequestException(
        ApiResponse.error('Product name and category are required', 400),
      );
    }

    const newProduct = await this.productService.create(data);
    return ApiResponse.success('Product created successfully', newProduct);
  }

  @Post('restore/:id') 
  @HttpCode(200)
  async restoreProduct(@Param('id', ParseIntPipe) id: number) {
    const restoreResult = await this.productService.restore(id);
    if (!restoreResult) {
      throw new NotFoundException(
        ApiResponse.error('Product not found for restoration', 404),
      );
    }
    return ApiResponse.success('Product restored successfully', restoreResult);
  }

  @Get(':id') 
  @HttpCode(200)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(ApiResponse.error('Product not found', 404));
    }
    return ApiResponse.success('Product retrieved successfully', product);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    if (!data.updatedBy) {
      throw new BadRequestException(
        ApiResponse.error('updatedBy is required for update', 400),
      );
    }

    const updatedProduct = await this.productService.update(id, data);
    if (!updatedProduct) {
      throw new NotFoundException(
        ApiResponse.error('Product not found for update', 404),
      );
    }
    return ApiResponse.success('Product updated successfully', updatedProduct);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SoftDeleteProductDto,
  ) {
    if (!body.updatedBy) {
      throw new BadRequestException(
        ApiResponse.error('updatedBy is required for deletion', 400),
      );
    }

    // Jika `softDelete` hanya menerima `id` dan `updatedBy`, ubah pemanggilan ini
    const isDeleted = await this.productService.softDelete(id, body.updatedBy);

    if (!isDeleted) {
      throw new NotFoundException(
        ApiResponse.error('Product not found for deletion', 404),
      );
    }

    console.log(`Product with ID ${id} deleted successfully.`);
    return ApiResponse.success('Product deleted successfully', isDeleted);
  }
}
