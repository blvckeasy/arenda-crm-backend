import { IsOptional, IsString } from 'class-validator';

export class SortDto {
  @IsString()
  @IsOptional()
  sortField: string;

  @IsString()
  @IsOptional()
  sortOrder: 'asc' | 'desc';
}
