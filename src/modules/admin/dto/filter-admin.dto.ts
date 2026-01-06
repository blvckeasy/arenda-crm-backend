import { IsInt, IsOptional, IsString } from 'class-validator';

export class FilterAdminDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class FindOneDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class FindAllDto {
  @IsOptional()
  @IsString()
  username?: string;
}