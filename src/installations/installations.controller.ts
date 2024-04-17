import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InstallationsService } from './installations.service';
import {
  CreateInstallationDataDto,
  CreateInstallationDto,
  UpdateInstallationDto,
} from './dto/installation.dto';
import { Public } from '@app/common/decorators/public.decorator';
import {
  UpdateAssignedPeople,
  UpdateNextServiceAt,
} from '@app/service-calls/dto/service-call.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('installations')
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) { }

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
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateInstallationDataDto,
  ) {
    const fileNames = files.map((file) => file.filename);
    return this.installationsService.completeInstallation(fileNames, body);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstallationDto: CreateInstallationDto) {
    return this.installationsService.create(createInstallationDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Headers('x-session-id') sessionId: String) {
    return this.installationsService.findAll(sessionId);
  }

  @Public()
  @Post('/customers')
  @HttpCode(HttpStatus.OK)
  findAllForCustomer(
    @Headers('x-session-id') sessionId: String,
    @Body('customer') id: String,
    @Body('completed') completed: Boolean,
  ) {
    return this.installationsService.findAllForCustomer(
      sessionId,
      id,
      completed,
    );
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(id);
  }

  @Public()
  @Post('assign-people')
  @HttpCode(HttpStatus.OK)
  updateAssignedPeople(@Body() dto: UpdateAssignedPeople) {
    return this.installationsService.updateAssignedPeople(dto);
  }

  @Public()
  @Post('update-next-service-date')
  @HttpCode(HttpStatus.OK)
  updateNextServiceDate(@Body() dto: UpdateNextServiceAt) {
    return this.installationsService.updateNextServiceDate(dto);
  }

  @Public()
  @Patch()
  update(
    @Body('id') id: string,
    @Body() updateInstallationDto: UpdateInstallationDto,
  ) {
    return this.installationsService.update(id, updateInstallationDto);
  }

  @Public()
  @Delete()
  remove(@Body('id') id: string) {
    return this.installationsService.remove(id);
  }
}
