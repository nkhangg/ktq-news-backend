// auth.middleware.ts

import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { KtqAdminsService } from '@/modules/ktq-admins/services/ktq-admins.service';
import { KtqAuthService } from '@/modules/ktq-auth/ktq-auth.service';
import { plainToClass } from 'class-transformer';
import KtqAdmin from '@/modules/ktq-admins/entities/ktq-admin.entity';
import KtqResponse from '@/system/response/ktq-response';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: KtqAdminsService,
    private readonly authService: KtqAuthService,
  ) {}

  async validate(result: Record<string, any>, next: NextFunction) {
    const admin = await this.adminService.ktqAdminRepo.findOne({
      where: { id: result?._id },
    });

    if (!admin) {
      return next(
        new UnauthorizedException(
          KtqResponse.toResponse(null, {
            message: 'User is invalid',
            status_code: HttpStatus.UNAUTHORIZED,
            bonus: { redirect: true },
          }),
        ),
      );
    }

    return admin;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const { access_token, refresh_token }: Record<string, any> = req.cookies;

    if (!access_token && !refresh_token) {
      return next(
        new UnauthorizedException(
          KtqResponse.toResponse(false, {
            message: 'Please login to app',
            status_code: HttpStatus.UNAUTHORIZED,
            bonus: { redirect: true },
          }),
        ),
      );
    }

    try {
      const result = await this.jwtService.verify(access_token);

      if (result.refresh_key || !result?._id) {
        return next(
          new ForbiddenException(
            KtqResponse.toResponse(null, {
              message: 'Token is invalid',
              status_code: HttpStatus.FORBIDDEN,
            }),
          ),
        );
      }

      const admin = await this.validate(result, next);

      req['admin'] = plainToClass(KtqAdmin, admin);
      next();
    } catch (error) {
      try {
        const result = await this.jwtService.verify(refresh_token);
        const admin = (await this.validate(result, next)) as KtqAdmin;

        await this.authService.login(admin, res);
        req['admin'] = plainToClass(KtqAdmin, admin);
        next();
      } catch (error) {
        return next(
          new UnauthorizedException(
            KtqResponse.toResponse(null, {
              message: 'Token is expired',
              status_code: HttpStatus.UNAUTHORIZED,
            }),
          ),
        );
      }
    }
  }
}
