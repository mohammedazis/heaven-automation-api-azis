import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConvertLeadDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead } from './schemas/lead.schema';
import { CustomersService } from '@app/customers/customers.service';
import { Session } from '@app/users/schemas/session.schema';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<Lead>,
    private customersService: CustomersService,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) { }

  async convertLead(updateLeadDto: ConvertLeadDto) {
    await this.leadModel.findByIdAndUpdate(updateLeadDto.id, {
      ...updateLeadDto,
      converted: true,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Converted Successfully',
    };
  }

  async uploadFiles(id: String, files: String[]) {
    await this.leadModel.findByIdAndUpdate(id, {
      files,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Files Uploaded Successfully',
    };
  }

  async create(createLeadDto: CreateLeadDto) {
    await new this.leadModel({ ...createLeadDto }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
    };
  }


  async convertedLeads(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session) throw new ForbiddenException('UnAuthorized');

    const leads = await this.leadModel
      .find({ converted: true })
      .populate('services')
      .populate('assignedTo', ['name', 'mobileNumber'])
      .populate('assignedBy', ['name', 'mobileNumber'])
      .populate('createdBy', ['name', 'mobileNumber'])
      .populate('updatedBy', ['name', 'mobileNumber']);

    return {
      statusCode: HttpStatus.OK,
      leads,
    };
  }

  async findAll(queryParams: any, sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session) throw new ForbiddenException('UnAuthorized');

    let leads = [];

    if (session.type == 'admin') {
      leads = await this.leadModel
        .find({
          converted: false
        })
        .populate('services')
        .populate('assignedTo', ['name', 'mobileNumber'])
        .populate('assignedBy', ['name', 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber'])
        .populate('createdBy', ['name', 'mobileNumber'])
        .populate('updatedBy', ['name', 'mobileNumber']);
    } else {
      leads = await this.leadModel
        .find({
          assignedTo: session.user,
          converted: false
        })
        .populate('services')
        .populate('assignedTo', ['name', 'mobileNumber'])
        .populate('assignedBy', ['name', 'mobileNumber']);
    }
    return {
      statusCode: HttpStatus.OK,
      leads,
    };
  }

  findOne(id) {
    return this.leadModel.findById(id);
  }

  async update(id: String, updateLeadDto: UpdateLeadDto) {
    console.log(id)
    console.log(updateLeadDto)
    await this.leadModel.findByIdAndUpdate(id, { ...updateLeadDto, liveLocation: updateLeadDto.liveLocation, });

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async remove(id: String) {
    await this.leadModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted Successfully',
    };
  }
}
