import { IsNumber, IsOptional, IsEnum, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { PaymentStatus } from "@blvckeasy/arenda-crm-core";

export class UpdateContractPaymentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dueAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  paidAmount?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidAt?: Date;
}