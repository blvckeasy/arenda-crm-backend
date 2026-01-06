import { IsDate, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateContractScheduleDto {
  @IsNumber()
  @Type(() => Number)
  monthNumber: number;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  contract_id?: number;
}