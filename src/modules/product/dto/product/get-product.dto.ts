import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProductStatus, RecordStatus } from '@blvckeasy/arenda-crm-core';
import { Type } from 'class-transformer';

export class GetProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  purchasePrice?: number;

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
  @IsEnum(ProductStatus)
  status?: ProductStatus;
  
  @IsOptional()
  @IsEnum(RecordStatus)
  recordStatus?: RecordStatus;
}
