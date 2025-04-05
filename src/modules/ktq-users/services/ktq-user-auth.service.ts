import { SystemLang } from '@/system/lang/system.lang';
import KtqResponse from '@/system/response/ktq-response';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { SystemRegisterDto } from '../dto/system-register.dto';
import { KtqTokenBlackList } from '../entities/ktq-token-black-lists.entity';
import { KtqUserAuthentication } from '../entities/ktq-user-authentication.entity';
import { KtqUser } from '../entities/ktq-user.entity';
import { EAuthProvider } from '../enum/auth-provider.enum';
import { ILoginWithGoogle } from '../type/interface';
import { Constant } from '../ultils/constant';

@Injectable()
export class KtqUsersAuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(KtqUser)
    readonly ktqUserRepo: Repository<KtqUser>,
    @InjectRepository(KtqTokenBlackList)
    readonly tokenBlackListsRepo: Repository<KtqTokenBlackList>,
    @InjectRepository(KtqUserAuthentication)
    readonly ktqUserAuthenticationRepo: Repository<KtqUserAuthentication>,
  ) {}

  async createToken(user: KtqUser, type: EAuthProvider) {
    const payload = { id: user.id, provider_type: type };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { refresh_key: true, ...payload },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginWithGoogle(data: ILoginWithGoogle, response: Response) {
    const prevUser = await this.ktqUserRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.authentications', 'auth')
      .where('user.email = :email', { email: data.email })
      .andWhere('auth.provider = :provider', { provider: EAuthProvider.GOOGLE })
      .andWhere('auth.provider_id = :providerId', {
        providerId: data.providerId,
      })
      .getOne();

    // Return new
    if (prevUser) {
      return this.login(prevUser, response);
    }

    const user = await this.ktqUserRepo.save({
      email: data.email,
      avatar: data.avatar,
      display_name: data.displayName,
      authentications: [
        this.ktqUserAuthenticationRepo.create({
          provider: EAuthProvider.GOOGLE,
          provider_id: data.providerId,
        }),
      ],
    });

    if (!user)
      throw new BadRequestException(
        KtqResponse.toResponse(null, {
          message: SystemLang.getText('messages', 'error'),
        }),
      );

    return this.login(user, response);
  }

  async validate(
    email: string,
    password: string,
    message = 'Email or Password is cornet',
  ) {
    const user = await this.ktqUserRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message,
          status_code: HttpStatus.UNAUTHORIZED,
        }),
      );
    }

    const authentication = await this.ktqUserAuthenticationRepo.findOne({
      where: {
        user: { id: user.id },
        provider: EAuthProvider.SYSTEM,
      },
    });

    if (
      !authentication ||
      !(await bcrypt.compare(password, authentication.password))
    ) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message,
          status_code: HttpStatus.UNAUTHORIZED,
        }),
      );
    }

    return user;
  }

  async login(user: KtqUser, response: Response) {
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

    return KtqResponse.toResponse(true, {
      message: SystemLang.getText('messages', 'logout_success'),
    });
  }

  async register(data: SystemRegisterDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.ktqUserRepo.save({
      display_name: data.name,
      email: data.email,
      authentications: [
        this.ktqUserAuthenticationRepo.create({
          password: hashPassword,
          provider: EAuthProvider.SYSTEM,
        }),
      ],
    });

    if (!newUser)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: SystemLang.getText('messages', 'register_failure'),
        }),
      );

    return KtqResponse.toResponse(true, {
      message: SystemLang.getText('messages', 'register_success'),
    });
  }

  async logout(request: Request, response: Response) {
    const access_token = request.cookies[Constant.ACCESS_TOKEN];
    const refresh_token = request.cookies[Constant.REFRESH_TOKEN];

    const user = request['user'];

    const checkTokenExpiry = (token: string) => {
      try {
        const decoded = this.jwtService.verify(token) as { exp?: number };
        return decoded?.exp ? new Date(decoded.exp * 1000) : null;
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    const accessTokenExpiry = checkTokenExpiry(access_token);
    const refreshTokenExpiry = checkTokenExpiry(refresh_token);

    if (accessTokenExpiry) {
      this.tokenBlackListsRepo.save({
        user,
        token: access_token.slice(-10),
        expires_at: accessTokenExpiry,
      });
    }

    if (refreshTokenExpiry) {
      this.tokenBlackListsRepo.save({
        user,
        token: refresh_token.slice(-10),
        expires_at: refreshTokenExpiry,
      });
    }

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

    return KtqResponse.toResponse(true, {
      message: SystemLang.getText('messages', 'logout_success'),
    });
  }

  async me(request: Request) {
    const user = request['user'];

    if (!user) throw new UnauthorizedException(KtqResponse.toResponse(null));

    return KtqResponse.toResponse(user);
  }
}
