import { Controller, Get } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqAdminsService } from '../services/ktq-admins.service';
import { KtqPermissionService } from '../services/ktq-permission.service';

@Controller('admin/permissions')
export class KtqPermissionsController {
  constructor(private readonly ktqPermissionService: KtqPermissionService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqPermissionService.index(query);
  }
}
