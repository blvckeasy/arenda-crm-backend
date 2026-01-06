import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  fullname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
