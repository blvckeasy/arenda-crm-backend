import { IsString, IsOptional } from 'class-validator';

export class IncludeQueryParamDto {
  @IsOptional()
  @IsString()
  include?: string;
}
