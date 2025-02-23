import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import KtqPermission from '../entities/ktq_permission.entity';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import KtqResponse from '@/system/response/ktq-response';

@Injectable()
export class KtqPermissionService {
  constructor(
    @InjectRepository(KtqPermission)
    readonly ktqPermissionRepo: Repository<KtqPermission>,
  ) {}

  async getPermissionsByAdmin(adminId: number): Promise<KtqPermission[]> {
    return await this.ktqPermissionRepo
      .createQueryBuilder('permission')
      .innerJoin('permission.admins', 'admin')
      .where('admin.id = :adminId', { adminId })
      .getMany();
  }

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqPermission> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      created_at: true,
      updated_at: true,
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqPermissionRepo, {
      sortableColumns: ['id'],
      searchableColumns: ['id'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqPermission>(data, true, KtqPermission);
  }
}
