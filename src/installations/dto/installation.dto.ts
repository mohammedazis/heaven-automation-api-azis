import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/customers/dto/address.dto';

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

export class CreateInstallationDto {
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
  remarks: String;

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
  @IsDateString()
  @IsNotEmpty()
  assignedAt: String;

  @Type(() => CreateAddressDto)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  address: CreateAddressDto;
}

export class UpdateInstallationDto extends PartialType(CreateInstallationDto) { }

export class CreateInstallationDataDto {
  @IsString()
  @IsNotEmpty()
  remarks: String;

  @IsString()
  @IsNotEmpty()
  serviceCallData: String;

  @IsString()
  @IsNotEmpty()
  serviceCall: String;

  @IsString()
  @IsNotEmpty()
  installation: String;

  @ToBoolean()
  @IsNotEmpty()
  isCompleted: Boolean;

  @ToBoolean()
  @IsNotEmpty()
  isPending: Boolean;

  @IsString()
  @IsNotEmpty()
  uploadedBy: String;

  @IsDateString()
  @IsNotEmpty()
  uploadedAt: String;

  @IsDateString()
  @IsNotEmpty()
  installationDateAt: String;
}
