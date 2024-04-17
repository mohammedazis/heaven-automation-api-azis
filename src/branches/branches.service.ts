import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Branch } from './schemas/branch.schema';
import { Model } from 'mongoose';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    await new this.branchModel({ ...createBranchDto }).save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created Successfully',
    };
  }

  findAll() {
    return this.branchModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    await this.branchModel.findByIdAndUpdate(id, updateBranchDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
