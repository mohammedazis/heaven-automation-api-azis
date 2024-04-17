import * as moment from "moment";
import { InjectModel } from '@nestjs/mongoose';
import { Installation } from './schemas/installation.schema';
import { Model } from 'mongoose';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateInstallationDataDto,
  CreateInstallationDto,
  UpdateInstallationDto,
} from './dto/installation.dto';
import { Session } from '@app/users/schemas/session.schema';
import {
  UpdateAssignedPeople,
  UpdateNextServiceAt,
} from '@app/service-calls/dto/service-call.dto';
import { ServiceCallsService } from '@app/service-calls/service-calls.service';
import { ServiceCall, ServiceCallData } from '@app/service-calls/schemas/service-call.schema';

@Injectable()
export class InstallationsService {
  constructor(
    @InjectModel(Installation.name)
    private readonly installationModel: Model<Installation>,

    @InjectModel(ServiceCall.name)
    private readonly serviceCallModel: Model<ServiceCall>,


    @InjectModel(ServiceCallData.name)
    private readonly serviceCallDataModel: Model<ServiceCallData>,

    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,

    private serviceCallService: ServiceCallsService,
  ) { }

  async completeInstallation(
    files: String[],
    createInstallationDto: CreateInstallationDataDto,
  ) {

    const curInstallation = await this.installationModel.findById(createInstallationDto.installation);

    const serviceCallData = await this.serviceCallDataModel.findById(createInstallationDto.serviceCallData);

    await this.serviceCallDataModel.findByIdAndUpdate(createInstallationDto.serviceCallData, {
      files: [...serviceCallData.files, ...files],
      isCancel: false,
      isPending: createInstallationDto.isPending,
      isStarted: true,
      isCompleted: createInstallationDto.isCompleted,
      details: {
        isCurrentlyFromInstallation: !createInstallationDto.isCompleted,
      },
      ...createInstallationDto
    });

    if (createInstallationDto.isCompleted) {
      let currentDate = new Date(
        curInstallation.nextServiceAt.toString()
      );

      await this.serviceCallModel.findByIdAndUpdate(
        createInstallationDto.serviceCall,
        {
          assignedAt: '',
          assignedTo: null,
          assignedToSecond: null,
          nextServiceAt: currentDate,
          details: {
            isActive: false,
            isCurrentlyFromInstallation: false,
            serviceCall: null
          }
        },
      );

      await this.installationModel.findByIdAndUpdate(
        createInstallationDto.installation,
        {
          completed: true,
          assignedTo: null,
          assignedToSecond: null,
          serviceCall: createInstallationDto.serviceCall.toString(),
          updatedAt: new Date().toISOString(),
        },
      );
    } else {
      await this.serviceCallModel.findByIdAndUpdate(
        createInstallationDto.serviceCall,
        {
          updatedAt: new Date().toISOString()
        }
      );

      await this.installationModel.findByIdAndUpdate(
        createInstallationDto.installation,
        {
          updatedAt: new Date().toISOString(),
        },
      );
    }



    return {
      statusCode: HttpStatus.OK,
      message: "Updated Successfully",
    };
  }

  async create(createInstallationDto: CreateInstallationDto) {
    await new this.installationModel({ ...createInstallationDto }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
    };
  }

  async updateNextServiceDate(dto: UpdateNextServiceAt) {
    await this.installationModel.findByIdAndUpdate(dto.id, {
      updatedAt: new Date().toISOString(),
      nextServiceAt: moment(dto.nextServiceAt.toString(), 'DD-MM-YYYY').format()
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Installation Date Updated Successfully',
    };
  }

  async updateAssignedPeople(dto: UpdateAssignedPeople) {

    const curInstallation = await this.findOne(
      dto.id
    );

    const serviceCall = await this.serviceCallModel.create({
      mobileNumber: curInstallation.mobileNumber,
      service: String(curInstallation.service._id),
      customer: String(curInstallation.customer._id),
      createdBy: dto.user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      assignedAt: null,
      assignedToSecond: null,
      remarks: curInstallation.remarks,
      nextServiceAt: undefined,
      address: curInstallation.address,
      details: {
        isCurrentlyFromInstallation: true
      }
    });


    const serviceCallData = await new this.serviceCallDataModel({
      isPending: false,
      isCompleted: false,
      isStarted: false,
      serviceDateAt: serviceCall.nextServiceAt,
      isInstallation: true,
      service: serviceCall.service._id,
      createdBy: dto.user,
      serviceCall: serviceCall._id,
      createdAt: new Date().toISOString(),
      details: {
        isCurrentlyFromInstallation: true
      }
    }).save();



    let dd = {
      assignedTo: dto.assignedPeople,
      details: {
        isActive: true,
        serviceCall: serviceCall._id,
        serviceCallData: serviceCallData._id,
      }
    };


    if (dto.assignedPeopleSecond) {
      dd['assignedToSecond'] = dto.assignedPeopleSecond;
    }

    await this.installationModel.findByIdAndUpdate(dto.id, dd);

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async findAllForCustomer(sessionId, customer, completed) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session) throw new ForbiddenException('UnAuthorized');
    if (!customer) throw new ForbiddenException('UnAuthorized');

    if (session.type == 'admin') {
      return this.installationModel
        .find({ customer, completed })
        .populate('service', ['name'])
        .populate('serviceCall', ['name'])
        .populate('createdBy', ['name'])
        .populate('assignedTo', ['name', 'mobileNumber'])
        .populate('assignedToSecond', ['name', 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber']);
    } else {
      return [];
    }
  }
  async findAll(sessionId) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session) throw new ForbiddenException('UnAuthorized');

    if (session.type == 'admin') {
      return this.installationModel
        .find({ completed: false })
        .populate('service', ['name'])
        .populate('serviceCall', ['name'])
        .populate('createdBy', ['name'])
        .populate('assignedTo', ['name', 'mobileNumber'])
        .populate('assignedToSecond', ['name', 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber']);
    } else {
      return this.installationModel
        .find({ assignedTo: session.user, completed: false })
        .populate('service', ['name'])
        .populate('serviceCall', ['name'])
        .populate('createdBy', ['name'])
        .populate('assignedTo', ['name', 'mobileNumber'])
        .populate('assignedToSecond', ['name', 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber']);
    }
  }

  async findOne(id: String) {
    return await this.installationModel
      .findById(id)
      .populate('service', ['name'])
      .populate('customer', ['name', 'mobileNumber']);
  }

  async update(id: String, updateInstallationDto: UpdateInstallationDto) {
    await this.installationModel.findByIdAndUpdate(id, {
      ...updateInstallationDto,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async remove(id: String) {
    await this.installationModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted Successfully',
    };
  }
}
