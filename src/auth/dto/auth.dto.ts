import { UserTypes } from '@app/common/types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class AuthSignInDto {
  @IsPhoneNumber('IN')
  mobileNumber: string;

  @IsNotEmpty()
  password: string;
}

export class AuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsNotEmpty()
  @IsEnum(UserTypes)
  type: UserTypes;

  @IsString()
  @IsNotEmpty()
  branch: String;

  @IsString()
  @IsNotEmpty()
  password: String;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  mobileNumber: String;

  @IsBoolean()
  @IsNotEmpty()
  isActive: Boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  createdBy: String;
}
