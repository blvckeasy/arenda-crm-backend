import { RecordStatus } from '@blvckeasy/arenda-crm-core';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetCustomerDto {
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

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
