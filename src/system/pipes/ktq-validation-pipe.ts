import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import KtqResponse from '../response/ktq-response';

@Injectable()
export class KtqValidationPipes extends ValidationPipe {
  private EXCLUDE = ['CreateKtqProductDto'];

  public static errorsResponse(customErrors: any) {
    return KtqResponse.toResponse(null, {
      message: 'Validation pipes failed',
      status_code: HttpStatus.BAD_REQUEST,
      bonus: { errors: customErrors },
    });
  }

  public static internalServerResponse() {
    return KtqResponse.toResponse(null, {
      message: 'Internal server error',
      status_code: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  public static exceptionFactory(errors: ValidationError[]) {
    const customErrors = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));

    return new BadRequestException(
      KtqValidationPipes.errorsResponse(customErrors),
    );
  }

  constructor(options?: ValidationPipeOptions) {
    super({ ...options });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (this.EXCLUDE.includes(metadata.metatype?.name)) {
      return value;
    }
    return super.transform(value, metadata);
  }
}
