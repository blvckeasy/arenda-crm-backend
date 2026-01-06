import { IsArray, IsDate, IsOptional, IsNumber, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class UpdateContractDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  agreedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearPercent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  initialPayment?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  product_id?: number;

  @IsNumber()
  @Type(() => Number)
  customer_id?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  schedules_id?: number[];
}
