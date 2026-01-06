import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductCategoryBodyDto {
  @IsOptional()
  @IsString()
  name_uz?: string;

  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent_id?: number;
}