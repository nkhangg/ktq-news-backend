// auth.middleware.ts

import KtqAdmin from '@/modules/ktq-admins/entities/ktq-admin.entity';
import { KtqAdminsService } from '@/modules/ktq-admins/services/ktq-admins.service';
import { KtqAuthService } from '@/modules/ktq-auth/ktq-auth.service';
import KtqResponse from '@/system/response/ktq-response';
import { In } from 'typeorm';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import KtqPermission from '../entities/ktq_permission.entity';
import { KtqPermissionService } from '../services/ktq-permission.service';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: KtqAdminsService,
    private readonly authService: KtqAuthService,
    private readonly permissionService: KtqPermissionService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const admin: KtqAdmin | undefined = ({} = req['admin']);

    if (!admin) {
      next(
        new UnauthorizedException(
          KtqResponse.toResponse(null, {
            message: 'Un authentication',
            status_code: HttpStatus.UNAUTHORIZED,
          }),
        ),
      );

      return;
    }

    if (admin.is_system_account) {
      next();
      return;
    }

    const permissions = await this.permissionService.getPermissionsByAdmin(
      admin.id,
    );

    if (!permissions.some((item) => item.name === req.method)) {
      next(
        new ForbiddenException(
          KtqResponse.toResponse(null, {
            message: 'Forbidden',
            status_code: HttpStatus.FORBIDDEN,
          }),
        ),
      );
      return;
    }

    next();
  }
}
