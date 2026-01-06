import { 
  Matches,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from "class-validator";
import { 
  UserRoles
} from '@blvckeasy/arenda-crm-core';

export class SignUpAdminDto {
  @Matches(/^(?!.*\.\.)(?!^\.)(?!.*\.$)[a-zA-Z0-9_.]{1,30}$/, {
    message: 'Username faqat harflar, raqamlar, pastki chiziq va nuqtalardan iborat bo\'lishi kerak. Boshida va oxirida nuqta bo\'lmasligi, ketma-ket ikki nuqta bo\'lmasligi kerak.',
  })
  @MinLength(3, { message: 'Username 3 ta belgidan ko\'p bo\'lishi kerak' })
  @MaxLength(64, { message: 'Username 64 ta belgidan oshmasligi kerek' })
  @IsString({ message: 'Username satr ko\'rinishda berilishi kerak' })
  username: string;

  @MinLength(8, { message: 'Parol 8 ta belgidan ko\'p bo\'lishi kerak' })
  @MaxLength(64, { message: 'Parol 64 ta belgidan oshmasligi kerek' })
  @IsString({ message: 'Parol satr ko\'rinishda berilishi kerak' })
  password: string;

  @IsString({ message: 'Token satr ko\'rinishda berilishi kerak' })
  token: string;

  @IsEnum(UserRoles, { message: 'Noto\'g\'ri userRole qiymati' })
  userRole: UserRoles;
}
