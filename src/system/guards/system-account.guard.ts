import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import KtqResponse from '../response/ktq-response';

@Injectable()
export class SystemAccountGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.admin || !request.admin.is_system_account) {
      throw new ForbiddenException(
        KtqResponse.toResponse(null, {
          message: 'You are not allowed to access this resource.',
          status_code: HttpStatus.FORBIDDEN,
        }),
      );
    }

    return true;
  }
}
