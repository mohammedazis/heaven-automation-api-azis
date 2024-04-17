import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Customer } from './schemas/customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  async searchCustomer(mobileNumber: String) {
    const customers = await this.customerModel
      .find({
        $and: [{ mobileNumber: new RegExp(mobileNumber?.toString(), 'i') }],
      })
      .limit(5);

    return customers;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await new this.customerModel({
      ...createCustomerDto,
    }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
      id: customer._id.toString(),
    };
  }

  async findAll() {
    const customers = await this.customerModel.find();

    return {
      statusCode: HttpStatus.OK,
      customers,
    };
  }

  async findOne(id: String) {
    const customer = await this.customerModel.findById(id);

    if (!customer) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      customer,
    };
  }

  async update(id: String, updateCustomerDto: UpdateCustomerDto) {
    await this.customerModel.findByIdAndUpdate(id, updateCustomerDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Updated',
    };
  }

  async remove(id: String) {
    await this.customerModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Deleted',
    };
  }
}
