import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@app/common/decorators/public.decorator';
import { AuthSignInDto, AuthSignUpDto } from './dto/auth.dto';
import { ChangePasswordUserDto } from '@app/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: AuthSignUpDto): Promise<any> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthSignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('/change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() dto: ChangePasswordUserDto) {
    return this.authService.changePassword(dto);
  }

  @Public()
  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Headers('x-session-id') sessionId: string) {
    await this.authService.logout(sessionId);

    return {
      statusCode: 200,
      message: 'Logged Out Successfully',
    };
  }

  @Public()
  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  async getSessionAndUser(@Body('id') sessionId: string) {
    return await this.authService.getSessionAndUser(sessionId);
  }

  @Public()
  @Post('/tokens')
  @HttpCode(HttpStatus.OK)
  signInToken(@Body() dto) {
    return this.authService.signInToken(dto);
  }
}
