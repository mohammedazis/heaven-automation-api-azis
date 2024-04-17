import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.branchesService.findAll();
  }

  @Patch()
  @Public()
  @HttpCode(HttpStatus.OK)
  update(@Body('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

}
