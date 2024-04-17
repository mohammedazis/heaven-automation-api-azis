import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Headers,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { ConvertLeadDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { Public } from '@app/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Public()
  @Post('/upload')
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
  uploadFiles(
    @Body('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileNames = files.map((file) => file.filename);
    return this.leadsService.uploadFiles(id, fileNames);
  }

  @Public()
  @Patch('/convert')
  convertLead(@Body() updateLeadDto: ConvertLeadDto) {
    return this.leadsService.convertLead(updateLeadDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() queryParams: any,
    @Headers('x-session-id') sessionId: string,
  ) {
    return this.leadsService.findAll(queryParams, sessionId);
  }

  @Public()
  @Get('/converted')
  convertedLeads(
    @Headers('x-session-id') sessionId: string,
  ) {
    return this.leadsService.convertedLeads(sessionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch()
  update(@Body('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete()
  remove(@Body('id') id: string) {
    return this.leadsService.remove(id);
  }
}
