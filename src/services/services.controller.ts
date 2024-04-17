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
import { ServicesService } from './services.service';
import { CheckPermissions } from '@app/common/decorators/permissions.decorator';
import { Objects, Permissions } from '@app/common/constants';
import { Public } from '@app/common/decorators/public.decorator';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @CheckPermissions(Permissions.Create, Objects.Services)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @CheckPermissions(Permissions.Read, Objects.Services)
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':slug')
  @CheckPermissions(Permissions.Read, Objects.Services)
  findOne(@Param('slug') slug: string) {
    return this.servicesService.findOne(slug);
  }

  @Public()
  @Patch()
  update(@Body('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }
  
  @Public()
  @Delete()
  // @CheckPermissions(Permissions.Delete, Objects.Services)
  remove(@Body('id') id: string) {
    return this.servicesService.remove(id);
  }
}
