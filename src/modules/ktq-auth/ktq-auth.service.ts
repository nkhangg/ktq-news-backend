import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KtqAdminsService } from '../ktq-admins/services/ktq-admins.service';
import KtqAdmin from '../ktq-admins/entities/ktq-admin.entity';
import KtqResponse from '@/system/response/ktq-response';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Constant } from './ultils/constant';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class KtqAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly ktqAdminService: KtqAdminsService,
  ) {}

  async validateAdmin(
    username: string,
    password: string,
    message = 'Username or Password is cornet',
  ) {
    const user = await this.ktqAdminService.ktqAdminRepo.findOne({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        KtqResponse.toResponse(null, {
          message,
          status_code: HttpStatus.UNAUTHORIZED,
        }),
      );
    }

    return user;
  }

  async login(user: KtqAdmin, response: Response) {
    const payload = { _id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { refresh_key: true, ...payload },
      { expiresIn: '7d' },
    );

    response.cookie(Constant.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
    });

    response.cookie(Constant.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return KtqResponse.toResponse(true, { message: 'Login Success' });
  }

  async logout(@Res() response: Response) {
    response.cookie(Constant.ACCESS_TOKEN, '', {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'lax',
    });

    response.cookie(Constant.REFRESH_TOKEN, '', {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'lax',
    });

    return KtqResponse.toResponse(true, { message: 'Logout Success' });
  }

  async changePassword(
    data: ChangePasswordDto,
    request: Request,
    response: Response,
  ) {
    const admin = request['admin'];

    if (!admin) throw new UnauthorizedException(KtqResponse.toResponse(false));

    await this.validateAdmin(
      admin.username,
      data.password,
      'Password is invalid !',
    );

    const newPassword = await bcrypt.hash(data.newPassword, 10);
    const result = await this.ktqAdminService.ktqAdminRepo.update(admin.id, {
      password: newPassword,
    });

    if (!result.affected)
      throw new BadRequestException(KtqResponse.toResponse(false));

    await this.logout(response);

    return KtqResponse.toResponse(true, {
      message: 'Change password success. Please re-login !',
    });
  }

  async me(request: Request) {
    const admin = request['admin'];

    if (!admin) throw new UnauthorizedException(KtqResponse.toResponse(null));

    return KtqResponse.toResponse(admin);
  }
}
