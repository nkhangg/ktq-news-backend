import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KtqAdminsService } from '../services/ktq-admins.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import KtqAdmin from '../entities/ktq-admin.entity';
import { UpdateDto } from '../dtos/update.dto';
import { DeletesDto } from '../dtos/deletes.dto';
import { Request } from 'express';
import { CreateDto } from '../dtos/create.dto';
import KtqPermission from '../entities/ktq_permission.entity';
import { GrantNewPasswordDto } from '../dtos/grant-new-password.dto';
import { SystemAccountGuard } from '@/system/guards/system-account.guard';

@Controller('admin/admins')
export class KtqAdminsController {
  constructor(private readonly ktqAdminService: KtqAdminsService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqAdminService.index(query);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqAdmin['id']) {
    return await this.ktqAdminService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: KtqAdmin['id'], @Body() data: UpdateDto) {
    const permissions = data.permissions
      ? data.permissions.map((item) => {
          const permission = new KtqPermission();
          permission.id = item.id;
          permission.name = item.name;
          return permission;
        })
      : undefined;
    return await this.ktqAdminService.update(id, { ...data, permissions });
  }

  @Post('')
  async create(@Body() data: CreateDto) {
    return await this.ktqAdminService.create(data);
  }

  @Post('grant-new-password/:id')
  @UseGuards(SystemAccountGuard)
  async grantNewPassword(
    @Param('id') id: KtqAdmin['id'],
    @Body() data: GrantNewPasswordDto,
    @Req() request: Request,
  ) {
    return await this.ktqAdminService.grantNewPassword(
      id,
      data.password,
      request,
    );
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto, @Req() request: Request) {
    return await this.ktqAdminService.deletes(data.ids, request);
  }
}
