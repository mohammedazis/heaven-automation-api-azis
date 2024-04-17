import * as bcrypt from 'bcrypt';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, now } from 'mongoose';
import { ChangePasswordUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthSignInDto } from '@app/auth/dto/auth.dto';
import { Session } from './schemas/session.schema';
import {
  TimeSpan,
  comparePassword,
  createDate,
  hashData,
} from '@app/common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async updateSession(sessionId: string, fresh: boolean, expiresAt: Date) {
    return await this.sessionModel.findByIdAndUpdate(sessionId, {
      fresh,
      expiresAt,
    });
  }

  // async searchUsers(mobileNumber: String) {
  //   return await this.userModel.find({ $where : {} }).exec();
  // }

  async getSessions(user: string) {
    const sessions = await this.sessionModel.find({ user }).exec();
    return {
      sessions,
    };
  }

  async changePassword(dto: ChangePasswordUserDto) {
    const user = await this.userModel.findById(dto.user);

    if (!user) throw new ForbiddenException('No User Found');
    const passwordMatches = await comparePassword(
      dto.oldPassword.toString(),
      user.password.toString(),
    );
    if (!passwordMatches) throw new ForbiddenException('Password Wrong');
    await user
      .updateOne({
        password: await hashData(dto.newPassword.toString()),
        passwordUpdatedAt: now(),
      })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Password Changed Successfully',
    };
  }

  async deleteSession(sessionId: string) {
    await this.sessionModel.findByIdAndDelete(sessionId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Deleted Successfully',
    };
  }

  async getSession(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId).exec();
    return session;
  }

  async updateSessionFresh(sessionId: string) {
    return await this.sessionModel.findByIdAndUpdate(sessionId, {
      fresh: false,
    });
  }

  async createSession(user: string, type: string) {
    return await this.sessionModel.create({
      expiresAt: createDate(TimeSpan(30, 'd')),
      user,
      type,
      fresh: false,
    });
  }

  async create(createUserDto) {
    const user = await new this.userModel(createUserDto).save();

    if (user.type == 'admin') {
      enum PermissionTypes {
        Manage = 'manage',
        Create = 'create',
        Read = 'read',
        Update = 'update',
        Delete = 'delete',
      }

      enum Modules {
        Customers = 'customers',
        Installations = 'installations',
        Permissions = 'permissions',
        Services = 'services',
        Branches = 'branches',
        ServiceCalls = 'serviceCalls',
        Users = 'users',
        Leads = 'leads',
      }

      const modules = Object.values(Modules);
      const permissions = Object.values(PermissionTypes);

      const allPermissions = modules
        .map((module) =>
          permissions.map((permission) => `${permission}:${module}`),
        )
        .reduce((modules, permissions) => [...modules, ...permissions]);

      this.updatePermissions(user._id.toString(), allPermissions);
    } else {
      enum PermissionTypes {
        Manage = 'manage',
        Create = 'create',
        Read = 'read',
        Update = 'update',
      }

      enum Modules {
        Customers = 'customers',
        Installations = 'installations',
        ServiceCalls = 'serviceCalls',
      }

      const modules = Object.values(Modules);
      const permissions = Object.values(PermissionTypes);

      const allPermissions = modules
        .map((module) =>
          permissions.map((permission) => `${permission}:${module}`),
        )
        .reduce((modules, permissions) => [...modules, ...permissions]);

      this.updatePermissions(user._id.toString(), allPermissions);
    }

    return user;
  }

  async getPermissions(mobileNumber) {
    const user = await this.userModel.findOne({ mobileNumber: mobileNumber });
    return user.permissions;
  }

  // async findServicePersons() {
  //   const users = await this.userModel.find({ type: 'service-persons' });

  //   return {
  //     statusCode: HttpStatus.OK,
  //     users,
  //   };
  // }

  async findAllInActive() {
    const users = await this.userModel
      .find({ isActive: false })
      .select(['-password', '-rememberToken']);

    return {
      statusCode: HttpStatus.OK,
      users,
    };
  }
  async findAll() {
    const users = await this.userModel
      .find({ isActive: true })
      .populate('branch')
      .select(['-password', '-rememberToken']);

    return {
      statusCode: HttpStatus.OK,
      users,
    };
  }

  async findOne(id: string) {
    const { password, ...userWithOutPassword } = (
      await this.userModel.findById(id).exec()
    ).toObject();

    return {
      statusCode: HttpStatus.OK,
      user: userWithOutPassword,
    };
  }

  async findByMobileNumber(dto: AuthSignInDto) {
    const user = await this.userModel.findOne({
      mobileNumber: dto.mobileNumber,
    });
    if (!user) throw new ForbiddenException('No User Found');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Password Wrong');

    return user;
  }

  async updatePermissions(id: string, permissions: string[]) {
    await this.userModel.findByIdAndUpdate(id, {
      permissions,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Permissions Updated Successfully',
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(id, { ...updateUserDto });

    return {
      statusCode: HttpStatus.OK,
      message: 'Updated Successfully',
    };
  }

  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Deleted',
    };
  }

  async updateLastLoginAt(id) {
    await this.userModel.findByIdAndUpdate(id, {
      lastLoginAt: now(),
    });
  }
  async updateTokenToDb(id, token) {
    const tokenUpdate = await this.userModel.findByIdAndUpdate(id, {
      rememberToken: token,
    });
    return tokenUpdate;
  }
}
