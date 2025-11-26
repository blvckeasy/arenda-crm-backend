import { IsNumber, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class CreateContractPaymentDto {
  @IsNumber()
  @Type(() => Number)
  contractId: number;

  @IsNumber()
  @Type(() => Number)
  dueAmount: number;

  @IsNumber()
  @Type(() => Number)
  paidAmount: number;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsDate()
  @Type(() => Date)
  paidAt: Date;
}