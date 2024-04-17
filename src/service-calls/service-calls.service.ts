import * as moment from "moment";
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateServiceCallDataDto,
  CreateServiceCallDto,
  UpdateAssignedPeople,
  UpdateNextServiceAt,
  UpdateServiceCallDto,
} from './dto/service-call.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceCall, ServiceCallData } from './schemas/service-call.schema';
import { Model } from 'mongoose';
import { Session } from '@app/users/schemas/session.schema';

@Injectable()
export class ServiceCallsService {
  constructor(
    @InjectModel(ServiceCall.name)
    private readonly serviceCallModel: Model<ServiceCall>,

    @InjectModel(ServiceCallData.name)
    private readonly serviceCallDataModel: Model<ServiceCallData>,

    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) { }

  async cancelServiceCall(createServiceCallDataDto: CreateServiceCallDataDto) {

    let currentDate = new Date(
      createServiceCallDataDto.serviceDateAt.toString(),
    );
    currentDate.setDate(currentDate.getDate() + 45);

    await this.serviceCallDataModel.findByIdAndUpdate(createServiceCallDataDto.serviceCallData, {
      isCancel: createServiceCallDataDto.isCancel,
      remarks: createServiceCallDataDto.remarks,
      isCompleted: createServiceCallDataDto.isCompleted,
      isPending: createServiceCallDataDto.isPending,
      assignedTo: null,
      assignedToSecond: null,
      isStarted: true,
      uploadedBy: createServiceCallDataDto.uploadedBy,
      uploadedAt: new Date().toISOString(),
      details: {
        isActive: false,
      }
    });

    await this.serviceCallModel.findByIdAndUpdate(
      createServiceCallDataDto.serviceCall,
      {
        assignedAt: '',
        assignedTo: null,
        assignedToSecond: null,
        nextServiceAt: currentDate,
        details: {
          isActive: false,
          serviceCallData: null
        },
        updatedAt: new Date().toISOString(),
      },
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Cancelled Successfully',
    };
  }

  async completeServiceCall(
    files: String[],
    createServiceCallDataDto: CreateServiceCallDataDto,
  ) {

    const serviceCallData = await this.serviceCallDataModel.findById(createServiceCallDataDto.serviceCallData);

    await this.serviceCallDataModel.findByIdAndUpdate(createServiceCallDataDto.serviceCallData, {
      files: [...serviceCallData.files, ...files],
      isCancel: false,
      isPending: createServiceCallDataDto.isPending,
      isStarted: true,
      isCompleted: createServiceCallDataDto.isCompleted,
      ...createServiceCallDataDto
    })

    if (createServiceCallDataDto.isCompleted) {
      let currentDate = new Date(
        createServiceCallDataDto.serviceDateAt.toString(),
      );
      await this.serviceCallModel.findByIdAndUpdate(
        createServiceCallDataDto.serviceCall,
        {
          assignedAt: '',
          assignedTo: null,
          assignedToSecond: null,
          nextServiceAt: currentDate,
          details: {
            isActive: false,
            serviceCall: null
          }
        },
      );
    } else {
      await this.serviceCallModel.findByIdAndUpdate(
        createServiceCallDataDto.serviceCall,
        {
          updatedAt: new Date().toISOString()
        }
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Completed Successfully',
    };
  }

  async create(createServiceCallDto: CreateServiceCallDto) {
    const serviceCall = await new this.serviceCallModel({
      ...createServiceCallDto,
      details: {
        isActive: false,
        serviceCallData: null
      }
    }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
      id: serviceCall._id,
    };
  }

  async findAllServiceCallDatas(id: String) {

    const serviceCallDatas = await this.serviceCallDataModel
      .find({
        serviceCall: id,
      })
      .populate('serviceCall')
      .populate('uploadedBy', ['name'])
      .populate('assignedTo', ['name'])
      .populate('assignedToSecond', ['name'])
      .populate('createdBy', ['name', 'mobileNumber'])
      .populate('service').sort({ createdAt: -1 });

    return {
      statusCode: HttpStatus.OK,
      serviceCallDatas,
    };
  }
  async findAllServiceCallsCustomer(customer: String) {
    if (!customer) throw new ForbiddenException('UnAuthorized');

    return this.serviceCallModel
      .find({ customer })
      .populate('service', ['name'])
      .populate('createdBy', ['name'])
      .populate('assignedTo', ['name', , 'mobileNumber'])
      .populate('assignedToSecond', ['name', , 'mobileNumber'])
      .populate('customer', ['name', 'mobileNumber']);
  }

  async findAllCompletedServices(sessionId: String, isCurrentlyFromInstallation) {
    return await this.serviceCallDataModel
      .find({
        isCompleted: true
      })
      .populate('serviceCall')
      .populate('uploadedBy', ['name'])
      .populate('assignedTo', ['name'])
      .populate('assignedToSecond', ['name'])
      .populate('createdBy', ['name', 'mobileNumber'])
      .populate('service').sort({ createdAt: -1 });
  }

  async findAllPendings(sessionId: String, isCurrentlyFromInstallation) {

    return this.serviceCallDataModel
      .find({
        isPending: true,
        details: {
          isCurrentlyFromInstallation: isCurrentlyFromInstallation == 'true'
        }
      })
      .populate('serviceCall', ['name'])
      .populate('service', ['name'])
      .populate('uploadedBy', ['name']);
  }

  async findAll(sessionId: String) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session) throw new ForbiddenException('UnAuthorized');

    if (session.type == 'admin') {
      return this.serviceCallModel
        .find()
        .populate('service', ['name'])
        .populate('createdBy', ['name'])
        .populate('assignedTo', ['name', , 'mobileNumber'])
        .populate('assignedToSecond', ['name', , 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber']);
    } else {
      return this.serviceCallModel
        .find({ assignedTo: session.user })
        .populate('service', ['name'])
        .populate('createdBy', ['name'])
        .populate('assignedTo', ['name', , 'mobileNumber'])
        .populate('assignedToSecond', ['name', , 'mobileNumber'])
        .populate('customer', ['name', 'mobileNumber']);
    }
  }

  async updateNextServiceDate(dto: UpdateNextServiceAt) {
    await this.serviceCallModel.findByIdAndUpdate(dto.id, {
      updatedAt: new Date().toISOString(),
      nextServiceAt: moment(dto.nextServiceAt.toString(), 'DD-MM-YYYY').format()
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Next Service Date Updated Successfully',
    };
  }

  async updateAssignedPeople(dto: UpdateAssignedPeople) {

    const serviceCall = await this.serviceCallModel.findById(dto.id);

    let serviceCallReq = {
      isPending: false,
      isCompleted: false,
      isStarted: false,
      serviceDateAt: serviceCall.nextServiceAt,
      service: serviceCall.service._id,
      serviceCall: dto.id,
      createdBy: dto.user,
      createdAt: new Date().toISOString(),
      assignedTo: dto.assignedPeople,
    };

    if (dto.assignedPeopleSecond) {
      serviceCallReq['assignedToSecond'] = dto.assignedPeopleSecond
    }

    if (serviceCall.details && serviceCall.details['serviceCallData']) {
      let dd = {
        assignedTo: dto.assignedPeople,
      };

      if (dto.assignedPeopleSecond) {
        dd['assignedToSecond'] = dto.assignedPeopleSecond;
      }

      await this.serviceCallDataModel.findByIdAndUpdate(serviceCall.details['serviceCallData'], { ...dd, uploadedAt: new Date().toISOString(), uploadedBy: dto.user });
      await this.serviceCallModel.findByIdAndUpdate(dto.id, { ...dd, updatedAt: new Date().toISOString() });

    } else {
      const serviceCallData = await new this.serviceCallDataModel(serviceCallReq).save();
      let dd = {
        assignedTo: dto.assignedPeople,
        details: {
          isActive: true,
          serviceCallData: serviceCallData._id,
        }
      };

      if (dto.assignedPeopleSecond) {
        dd['assignedToSecond'] = dto.assignedPeopleSecond;
      }

      await this.serviceCallModel.findByIdAndUpdate(dto.id, dd);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async findOne(id: String) {
    return await this.serviceCallModel
      .findById(id)
      .populate('service', ['name'])
      .populate('customer', ['name', 'mobileNumber']);
  }

  async update(id: String, updateServiceCallDto: UpdateServiceCallDto) {
    await this.serviceCallModel.findByIdAndUpdate(id, {
      ...updateServiceCallDto,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async remove(id: String) {
    await this.serviceCallModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted Successfully',
    };
  }
}
