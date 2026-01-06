import { IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  fullName: string;

  @IsString()
  phone1: string;

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
