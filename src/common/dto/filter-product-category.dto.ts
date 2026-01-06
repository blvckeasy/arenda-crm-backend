import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FilterByIdDto {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
