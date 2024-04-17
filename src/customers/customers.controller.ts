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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, SearchCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Public } from '@app/common/decorators/public.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Public()
  @Post('search')
  @HttpCode(HttpStatus.OK)
  search(@Body() searchCustomerDto: SearchCustomerDto) {
    return this.customersService.searchCustomer(searchCustomerDto.mobileNumber);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.customersService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Public()
  @Patch()
  update(@Body('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Public()
  @Delete()
  // @CheckPermissions(Permissions.Delete, Objects.Services)
  remove(@Body('id') id: string) {
    return this.customersService.remove(id);
  }
}
