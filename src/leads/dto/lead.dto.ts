import { Priorities } from '@app/common/types';
import {
  CreateAddressDto,
  CreateCustomAddressDto,
  LeadCustomerContact,
} from '@app/customers/dto/address.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  reference: String;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  files: String[];

  @IsString()
  @IsNotEmpty()
  companyName: String;

  @IsArray()
  @IsNotEmpty()
  services: String[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: String;

  @IsString()
  @IsNotEmpty()
  createdBy: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  createdAt: String;

  @IsString()
  @IsNotEmpty()
  updatedBy: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  updatedAt: String;

  @IsDateString()
  @IsNotEmpty()
  nextFollowUpAt: String;

  @IsNotEmpty()
  @IsEnum(Priorities)
  priority: Priorities;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  assignedTo: String;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  assignedBy: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  assignedAt: String;

  @IsOptional()
  @Type(() => LeadCustomerContact)
  @ValidateNested()
  @IsObject()
  contactPerson: LeadCustomerContact;

  @IsOptional()
  @ValidateNested({})
  @Type(() => CreateCustomAddressDto)
  @IsObject({})
  customAddress: CreateCustomAddressDto;

  @IsOptional()
  @IsBoolean({})
  liveLocation: Boolean;

  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  address: CreateAddressDto;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsBoolean()
  @IsOptional()
  liveLocation: Boolean

}
export class ConvertLeadDto {
  @IsString()
  @IsNotEmpty()
  id: String;


  @IsString()
  @IsNotEmpty()
  customer: String;

  @IsString()
  @IsNotEmpty()
  description: String;

  @IsString()
  @IsNotEmpty()
  convertedBy: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  convertedAt: String;
}
