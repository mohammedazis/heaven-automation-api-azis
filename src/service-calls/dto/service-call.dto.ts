import { CreateAddressDto } from '@app/customers/dto/address.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  IsDateString,
  IsArray,
  IsBoolean,
  ValidateIf,
  IsBooleanString,
} from 'class-validator';

export class UpdateNextServiceAt {
  @IsString()
  @IsNotEmpty()
  id: String;

  @IsString()
  @IsNotEmpty()
  nextServiceAt: String;
}

const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
};

export class UpdateAssignedPeople {
  @IsString()
  @IsNotEmpty()
  user: String;

  @IsString()
  @IsNotEmpty()
  id: String;

  @IsString()
  @IsNotEmpty()
  assignedPeople: String;

  @IsOptional()
  @IsString()
  assignedPeopleSecond: String;
}

export class CreateServiceCallDataDto {
  @IsString()
  @IsNotEmpty()
  service: String;

  @IsString()
  @IsNotEmpty()
  serviceCallData: String;

  @IsString()
  @IsNotEmpty()
  serviceCall: String;

  @IsString()
  @IsNotEmpty()
  uploadedBy: String;

  @ValidateIf((each) => !each.isCancel)
  @IsDateString()
  @IsNotEmpty()
  uploadedAt: String;

  @IsDateString()
  @IsNotEmpty()
  serviceDateAt: String;

  @ToBoolean()
  @IsNotEmpty()
  isPending: Boolean;

  @ToBoolean()
  @IsNotEmpty()
  isCompleted: Boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isCancel: Boolean;

  @IsString()
  @IsNotEmpty()
  remarks: String;
}

export class CreateServiceCallDto {
  @IsPhoneNumber('IN')
  @IsNotEmpty()
  mobileNumber: String;

  @IsDateString()
  @IsNotEmpty()
  nextServiceAt: String;

  @IsString()
  @IsNotEmpty()
  service: String;

  @IsString()
  @IsNotEmpty()
  customer: String;

  @IsString()
  @IsNotEmpty()
  createdBy: String;

  @IsDateString()
  @IsNotEmpty()
  createdAt: String;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: String;

  @IsOptional()
  @IsNotEmpty()
  assignedTo: String;

  @IsOptional()
  @IsArray()
  assignedToSecond: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  assignedAt: String;

  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  address: CreateAddressDto;

  @IsString()
  @IsNotEmpty()
  remarks: String;
}

export class UpdateServiceCallDto extends PartialType(CreateServiceCallDto) { }
