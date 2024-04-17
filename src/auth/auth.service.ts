import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthSignInDto, AuthSignUpDto } from './dto/auth.dto';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '@app/common/types';
import { now } from 'mongoose';
import {
  TimeSpan,
  createDate,
  hashData,
  isWithinExpirationDate,
} from '@app/common/utils';
import { ChangePasswordUserDto } from '@app/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthSignUpDto) {
    const hash = await hashData(dto.password);
    dto.password = hash;

    const user = await this.usersService.create(dto);
    const tokens = await this.getToken(user._id.toString(), {
      name: user.name,
      permissions: user.permissions,
      mobileNumber: user.mobileNumber,
      isActive: user.isActive,
    });
    await this.saveTokenToDB(user._id.toString(), tokens.refresh_token);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully Created',
      id: user.id,
      name: user.name,
    };
  }

  async getSessionAndUser(sessionId: string) {
    const databaseSession = await this.usersService.getSession(sessionId);
    if (!databaseSession) return { session: null, user: null };

    const userData = await this.usersService.findOne(
      databaseSession.user.toString(),
    );
    const databaseUser = userData.user;
    if (!databaseUser) {
      await this.usersService.deleteSession(sessionId);
      return { session: null, user: null };
    }

    if (!isWithinExpirationDate(databaseSession.expiresAt)) {
      await this.usersService.deleteSession(sessionId);
      return { session: null, user: null };
    }
    const activePeriodExpirationDate = new Date(
      databaseSession.expiresAt.getTime() - TimeSpan(30, 'd') / 2,
    );

    const session = {
      id: databaseSession.id,
      user: databaseSession.user,
      expiresAt: databaseSession.expiresAt,
      fresh: false,
    };

    if (!isWithinExpirationDate(activePeriodExpirationDate)) {
      const newDate = createDate(TimeSpan(30, 'd'));
      await this.usersService.updateSession(sessionId, true, newDate);
      session.fresh = false;
      session.expiresAt = newDate;
    }
    const user = {
      ...databaseUser,
    };

    return {
      session,
      user,
    };
  }

  async signInToken(dto) {
    const tokenUser = await this.jwtService.decode(dto.token);
    if (!tokenUser.user) throw new ForbiddenException('UnAuthorized');
    // const { user } = await this.usersService.findOne(tokenUser.id);
    return tokenUser;
  }

  async logout(sessionId: string) {
    await this.usersService.deleteSession(sessionId);
  }

  async changePassword(dto: ChangePasswordUserDto) {
    return await this.usersService.changePassword(dto);
  }

  async signIn(dto: AuthSignInDto) {
    const user = await this.usersService.findByMobileNumber(dto);

    const session = await this.usersService.createSession(
      user._id.toString(),
      user.type.toString(),
    );

    // const tokens = await this.getToken(user._id.toString(), {
    //   isActive: user.isActive,
    //   mobileNumber: user.mobileNumber,
    //   name: user.name,
    //   permissions: user.permissions,
    // });

    // const rfToken = await this.saveTokenToDB(user.id, tokens.refresh_token);
    await this.saveLastLoginAt(user._id.toString());

    // user.rememberToken = rfToken.hash;
    user.lastLoginAt = now().toString();

    return {
      statusCode: HttpStatus.OK,
      message: 'Succesfully Logged In',
      user,
      session,
    };
  }

  async getToken(
    id: string,
    user: { name; isActive; permissions; mobileNumber },
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id, user },
        { expiresIn: 60 * 60 * 24, secret: 'at-secret' },
      ),
      this.jwtService.signAsync(
        { id, user },
        { expiresIn: 60 * 60 * 24 * 14, secret: 'rt-secret' },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async saveLastLoginAt(userId: string) {
    await this.usersService.updateLastLoginAt(userId);
  }

  async saveTokenToDB(userId: string, token: string) {
    const hash = await hashData(token);
    await this.usersService.updateTokenToDb(userId, hash);

    return {
      hash,
    };
  }
}
