import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get('/inactive')
  findAllInActive() {
    return this.usersService.findAllInActive();
  }

  @Get('/service-persons')
  async findServicePersons() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Post('/sessions')
  async getSessions(@Body('id') id: string) {
    return await this.usersService.getSessions(id);
  }

  @Public()
  @Post('/search')
  async searchUsers(@Body('mobileNumber') id: string) {
    return await this.usersService.getSessions(id);
  }

  @Public()
  @Patch('/permissions')
  @HttpCode(HttpStatus.OK)
  updatePermissions(
    @Body('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.usersService.updatePermissions(id, permissions);
  }

  @Public()
  @Patch()
  @HttpCode(HttpStatus.OK)
  update(@Body('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @Delete('session')
  removeSession(@Body('id') id: string) {
    return this.usersService.deleteSession(id);
  }

  @Public()
  @Delete()
  // @CheckPermissions(Permissions.Delete, Objects.Services)
  remove(@Body('id') id: string) {
    return this.usersService.remove(id);
  }
}
