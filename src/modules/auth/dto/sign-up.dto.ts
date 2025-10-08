import { 
  IsOptional, 
  IsString, 
  Validate, 
  IsEnum
} from "class-validator";
import { 
  UserRoles
} from '@blvckeasy/arenda-crm-core';

export class SignUpAdminDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  googleToken: string;

  @IsEnum(UserRoles)
  userRole: UserRoles;
}
