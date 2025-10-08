import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { RecordStatus } from '@blvckeasy/arenda-crm-core';
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

  @IsNumber()
  @Type(() => Number)
  rentalPrice: number;

  @IsNumber()
  @Type(() => Number)
  yearPercent: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
