import { ConfigValueType } from '@/modules/ktq-configs/entities/ktq-config.entity';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isConfigValue', async: false })
export class IsConfigValue implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const { type } = args.object as any;

    if (type === ConfigValueType.NUMBER) {
      return !isNaN(Number(value));
    }

    if (type === ConfigValueType.JSON) {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }

    return typeof value === 'string' && value.length >= 4;
  }

  defaultMessage(args: ValidationArguments) {
    const { type } = args.object as any;

    if (type === ConfigValueType.NUMBER) return 'Value must be a valid number';
    if (type === ConfigValueType.JSON) return 'Value must be a valid JSON';
    return 'Value must be at least 4 characters long';
  }
}
