import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsNotEmpty()
  slug: String;

  @IsString()
  @IsNotEmpty()
  createdBy: String;

  @IsDateString()
  @IsNotEmpty()
  createdAt: String;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
