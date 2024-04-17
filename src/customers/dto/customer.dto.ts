import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  mobileNumber: String;

  @IsString()
  @IsNotEmpty()
  createdBy: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  createdAt: String;
}
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class SearchCustomerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobileNumber: String;
}
