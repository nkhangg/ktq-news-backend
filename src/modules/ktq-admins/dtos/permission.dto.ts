import { HasExisted } from '@/system/validators/decorators/has-existed';
import { IsNumber, IsString } from 'class-validator';

export class PermissionDto {
  @IsNumber()
  @HasExisted({ tableName: 'ktq_permissions', column: 'id' })
  id: number;

  @IsString()
  name: string;
}
