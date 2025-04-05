import { SystemLang } from '@/system/lang/system.lang';
import KtqResponse from '@/system/response/ktq-response';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { join } from 'path';
import { SystemLoginDto } from '../../dto/system-login.dto';
import { SystemRegisterDto } from '../../dto/system-register.dto';
import { KtqUsersAuthService } from '../../services/ktq-user-auth.service';
import { Constant } from '../../ultils/constant';

@Controller('client/auth')
export class KtqUsersAuthController {
  constructor(
    private readonly userAuthService: KtqUsersAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Google xử lý login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const access_token = req.cookies[Constant.ACCESS_TOKEN];

    if (access_token) return res.redirect('success');

    await this.userAuthService.loginWithGoogle(
      {
        providerId: user['providerId'],
        email: user['email'],
        displayName: user['displayName'],
        avatar: user['avatar'],
      },
      res,
    );

    return res.redirect('success');
  }

  @Get('google/success')
  async googleSuccess(@Req() req: Request, @Res() res: Response) {
    res.setHeader(
      'Content-Security-Policy',
      `script-src 'self' 'unsafe-inline';`,
    );
    const filePath = join(
      process.cwd(),
      'src/modules/ktq-users/views/google-success.html',
    );
    return res.sendFile(filePath);
  }

  @Post('register')
  async systemRegister(@Body() data: SystemRegisterDto) {
    return await this.userAuthService.register(data);
  }

  @Post('login')
  async systemLogin(
    @Body() loginDto: SystemLoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const access_token = request.cookies[Constant.ACCESS_TOKEN];

    if (access_token)
      throw new ConflictException(
        KtqResponse.toResponse(null, {
          status_code: HttpStatus.CONFLICT,
          message: SystemLang.getCustomText({
            en: 'Account is logged in',
            vi: 'Tài khoản đã được đăng nhập!',
          }),
        }),
      );

    return await this.userAuthService
      .validate(loginDto.email, loginDto.password)
      .then((admin) => this.userAuthService.login(admin, response));
  }

  @Get('me')
  async me(@Req() request: Request) {
    return await this.userAuthService.me(request);
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.userAuthService.logout(request, response);
  }
}
