import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsNotEmpty()
  branchName: String;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  createdAt: String;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @IsString()
  @IsNotEmpty()
  id: String;
}
