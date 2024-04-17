import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service } from './schemas/service.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    await new this.serviceModel({ ...createServiceDto }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Service Created Successfully',
    };
  }

  async findAll() {
    const services = await this.serviceModel.find();

    return {
      statusCode: HttpStatus.OK,
      count: services.length,
      services,
    };
  }

  async findOne(slug: String) {
    const service = await this.serviceModel.findOne({
      slug,
    });

    return {
      statusCode: HttpStatus.OK,
      service: service,
    };
  }

  async update(id: String, updateServiceDto: UpdateServiceDto) {
    await this.serviceModel.findByIdAndUpdate(id, updateServiceDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Updated',
    };
  }

  async remove(id: String) {
    await this.serviceModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Deleted',
    };
  }
}
