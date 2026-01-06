import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone1?: string;

  @IsOptional()
  @IsString()
  phone2?: string;

  @IsOptional()
  @IsString()
  passportSery?: string;

  @IsOptional()
  @IsString()
  passportInn?: string;

  @IsOptional()
  @IsString()
  passportPinfl?: string;
}
