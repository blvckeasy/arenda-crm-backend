import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name_uz: string;

  @IsString()
  name_ru: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parent_id?: number;
}
