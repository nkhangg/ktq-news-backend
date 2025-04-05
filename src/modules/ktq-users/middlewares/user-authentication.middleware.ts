// auth.middleware.ts

import KtqResponse from '@/system/response/ktq-response';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { KtqUser } from '../entities/ktq-user.entity';
import { KtqUsersAuthService } from '../services/ktq-user-auth.service';
import { KtqTokenBlackList } from '../entities/ktq-token-black-lists.entity';
import { MoreThan } from 'typeorm';
@Injectable()
export class UserAuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: KtqUsersAuthService,
  ) {}

  async validate(result: Record<string, any>, next: NextFunction) {
    const user = await this.userAuthService.ktqUserRepo.findOne({
      where: { id: result?._id },
    });

    if (!user) {
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

    return user;
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

      const user = await this.validate(result, next);

      if (user) {
        const blackListToken =
          await this.userAuthService.tokenBlackListsRepo.findOne({
            where: {
              user: { id: user.id },
              expires_at: MoreThan(new Date()),
              token: access_token.slice(-10),
            },
          });

        if (blackListToken) {
          return next(
            new ForbiddenException(
              KtqResponse.toResponse(null, {
                message: 'Token is invalid',
                status_code: HttpStatus.FORBIDDEN,
              }),
            ),
          );
        }
      }

      req['user'] = plainToClass(KtqUser, user);
      next();
    } catch (error) {
      try {
        const result = await this.jwtService.verify(refresh_token);
        const user = (await this.validate(result, next)) as KtqUser;

        await this.userAuthService.login(user, res);
        req['user'] = plainToClass(KtqUser, user);
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
