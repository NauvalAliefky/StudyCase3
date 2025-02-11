import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stockQuantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  createdBy: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}