import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProductStatus, RecordStatus } from '@blvckeasy/arenda-crm-core';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  category: number;

  @IsNumber()
  @Type(() => Number)
  purchasePrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
