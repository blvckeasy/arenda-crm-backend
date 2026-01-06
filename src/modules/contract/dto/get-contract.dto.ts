import { IsDate, IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class GetContractDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  agreedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearPercent?: number;

  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  customer_id: number;
}
