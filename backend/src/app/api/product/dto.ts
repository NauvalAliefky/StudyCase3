/* eslint-disable prettier/prettier */
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsDateString 
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  stockQuantity: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductStatus, { message: 'Invalid status' })
  status: ProductStatus;

  @IsString()
  createdBy: string;

  @IsDateString()
  createdAt: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  price?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  stockQuantity?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductStatus, { message: 'Invalid status' })
  @IsOptional()
  status?: ProductStatus;

  @IsString({ message: 'UpdatedBy is required' })
  updatedBy: string;

  @IsDateString()
  updatedAt: string;
}

export class SoftDeleteProductDto {
  @IsString({ message: 'UpdatedBy is required for delete' })
  updatedBy: string;

  @IsDateString()
  @IsOptional() // DeletedAt bisa dikosongkan dan diatur otomatis di backend
  deletedAt?: string;
}
