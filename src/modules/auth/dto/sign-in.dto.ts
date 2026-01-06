import { 
  IsOptional, 
  IsString, 
  Validate, 
  ValidatorConstraint, 
  ValidatorConstraintInterface, 
  ValidationArguments, 
  IsEnum
} from "class-validator";
import { 
  MissingAuthCredentialsError,
  UserRoles
} from '@blvckeasy/arenda-crm-core';


@ValidatorConstraint({ name: "SignInAdminDtoValidation", async: false })
class SignInAdminDtoValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as SignInAdminDto;

    const { username, password, googleToken } = dto;

    // 1) Agar googleToken bo‘lsa, username va password bo‘lmasligi kerak
    if (googleToken) {
      return !username && !password;
    }

    // 2) Agar googleToken bo‘lmasa, username va password ikkalasi ham bo‘lishi shart
    if (!googleToken) {
      return !!username && !!password;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): never {
    throw new MissingAuthCredentialsError();
  }
}

export class SignInAdminDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  googleToken?: string;

  @IsEnum(UserRoles)
  userRole: UserRoles;

  @Validate(SignInAdminDtoValidation)
  checkValidCombination: boolean;
}
