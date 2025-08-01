import { registerDecorator, ValidationOptions } from 'class-validator';
import { HasExistedValidator } from '../has-existed.validator';

export type IsExitedInput = {
    tableName: string;
    column: string;
    queryOption?: Record<string, any>;
    message?: string;
    each?: boolean;
    update?: boolean;
};

export function HasExisted(options: IsExitedInput, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'has-exited',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: HasExistedValidator,
        });
    };
}
