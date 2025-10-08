import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { RecordStatus } from '@blvckeasy/arenda-crm-core';
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
  category?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rentalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearPercent?: number;

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
