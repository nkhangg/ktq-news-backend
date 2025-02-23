import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { KtqAuthService } from './ktq-auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('admin/auth')
export class KtqAuthController {
  constructor(private readonly authService: KtqAuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService
      .validateAdmin(loginDto.username, loginDto.password)
      .then((admin) => this.authService.login(admin, response));
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(response);
  }

  @Post('change-password')
  async changePassword(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @Body() data: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(data, request, response);
  }

  @Get('me')
  async me(@Req() request: Request) {
    return this.authService.me(request);
  }
}
