import { IsDate, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetContractScheduleDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  monthNumber?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  contract?: number;
}