import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import KtqResponse from '../response/ktq-response';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new HttpException(
      KtqResponse.toResponse(null, {
        message: 'To many request',
        status_code: HttpStatus.TOO_MANY_REQUESTS,
      }),
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
