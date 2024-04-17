import { CreateAddressDto } from '@app/customers/dto/address.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsObject,
  IsDateString,
} from 'class-validator';

export class ChangePasswordUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: String;

  @IsString()
  @IsNotEmpty()
  newPassword: String;

  @IsString()
  @IsNotEmpty()
  user: String;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: String;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: String;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rememberToken: String;

  @IsPhoneNumber('IN')
  @IsOptional()
  @IsNotEmpty()
  mobileNumber: String;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  permissions: String[];

  @IsString()
  @IsNotEmpty()
  branch: String;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  isActive: Boolean;

  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  address: CreateAddressDto;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  lastLoginAt: String;
}
