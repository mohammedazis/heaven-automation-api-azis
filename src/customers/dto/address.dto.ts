import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsString,
  IsLatitude,
  IsLongitude,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class LeadCustomerContact {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  mobileNumber: String;
}

export class CreateCustomAddressDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  district: String;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  street: String;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  area: String;

  @IsString({})
  @IsOptional()
  landmark: String;
}

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  street: String;

  @IsString()
  @IsOptional()
  district: String;

  @IsNumber()
  @IsOptional()
  pincode: Number;

  @IsOptional()
  @IsString()
  area: String;

  @IsString()
  @IsOptional()
  state: String;

  @IsOptional()
  @IsString()
  latitude: String;

  @IsOptional()
  @IsString()
  longitude: String;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  landmark: String;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
