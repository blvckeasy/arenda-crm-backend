import { IsString, IsOptional } from 'class-validator';

export class QueryProductIncludeDto {
  @IsOptional()
  @IsString()
  include?: string;
}
