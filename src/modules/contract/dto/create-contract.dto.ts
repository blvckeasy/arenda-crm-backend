import { IsArray, IsDate, IsOptional, IsNumber, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateContractDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

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

  @IsNumber()
  @Type(() => Number)
  totalPrice: number;

  @IsDate()
  @Type(() => Date)
  firstPaymentDate: Date;

  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  customer_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  schedules_id: number[];
}
