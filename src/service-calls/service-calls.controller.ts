import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ServiceCallsService } from './service-calls.service';
import {
  CreateServiceCallDataDto,
  CreateServiceCallDto,
  UpdateAssignedPeople,
  UpdateNextServiceAt,
  UpdateServiceCallDto,
} from './dto/service-call.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('service-calls')
export class ServiceCallsController {
  constructor(private readonly serviceCallsService: ServiceCallsService) { }

  @Public()
  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const nameTab = file.originalname.split('.');
          const subArray = nameTab.slice(0, -1);
          const originalName = subArray.join('');
          const ext = `.${nameTab[nameTab.length - 1]}`;
          const filename = `${uniqueSuffix}-${originalName}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  completeServiceCall(
    @Body() body: CreateServiceCallDataDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileNames = files.map((file) => file.filename);
    return this.serviceCallsService.completeServiceCall(fileNames, body);
  }

  @Public()
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  cancelServiceCall(@Body() body: CreateServiceCallDataDto) {
    return this.serviceCallsService.cancelServiceCall(body);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServiceCallDto: CreateServiceCallDto) {
    return this.serviceCallsService.create(createServiceCallDto);
  }

  @Public()
  @Post('customers')
  @HttpCode(HttpStatus.OK)
  findAllServiceCallsCustomer(@Body('customer') customer: String) {
    return this.serviceCallsService.findAllServiceCallsCustomer(customer);
  }

  @Public()
  @Get('datas/:id')
  @HttpCode(HttpStatus.OK)
  findAllServiceCallDatas(@Param('id') id: string) {
    return this.serviceCallsService.findAllServiceCallDatas(id);
  }

  @Public()
  @Get('/completed')
  @HttpCode(HttpStatus.OK)
  findAllCompleted(@Headers('x-session-id') sessionId: String,
    @Query('type') type: Boolean,
  ) {
    return this.serviceCallsService.findAllCompletedServices(sessionId, type);
  }

  @Public()
  @Get('/pendings')
  @HttpCode(HttpStatus.OK)
  findAllPendings(@Headers('x-session-id') sessionId: String,
    @Query('type') type: Boolean,
  ) {
    return this.serviceCallsService.findAllPendings(sessionId, type);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Headers('x-session-id') sessionId: String) {
    return this.serviceCallsService.findAll(sessionId);
  }

  @Public()
  @Post('assign-people')
  @HttpCode(HttpStatus.OK)
  updateAssignedPeople(@Body() dto: UpdateAssignedPeople) {
    return this.serviceCallsService.updateAssignedPeople(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('update-next-service-date')
  updateNextServiceDate(@Body() dto: UpdateNextServiceAt) {
    return this.serviceCallsService.updateNextServiceDate(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceCallsService.findOne(id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(
    @Body('id') id: string,
    @Body() updateServiceCallDto: UpdateServiceCallDto,
  ) {
    return this.serviceCallsService.update(id, updateServiceCallDto);
  }

  @Delete()
  remove(@Body('id') id: string) {
    return this.serviceCallsService.remove(id);
  }
}
