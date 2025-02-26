import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import KtqAdmin from '../entities/ktq-admin.entity';
import { Column } from 'nestjs-paginate/lib/helper';
import * as bcrypt from 'bcrypt';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import KtqResponse from '@/system/response/ktq-response';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import KtqPermission from '../entities/ktq_permission.entity';

@Injectable()
export class KtqAdminsService {
  constructor(
    @InjectRepository(KtqAdmin)
    readonly ktqAdminRepo: Repository<KtqAdmin>,
    @InjectRepository(KtqPermission)
    readonly ktqPermissionRepo: Repository<KtqPermission>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqAdmin> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      username: [FilterOperator.ILIKE],
      fullname: [FilterOperator.ILIKE],
      email: [FilterOperator.ILIKE],
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqAdminRepo, {
      sortableColumns: ['id', 'username', 'email', 'created_at', 'updated_at'],
      searchableColumns: ['id', 'username', 'email'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'ASC']],
      maxLimit: 100,
      relations: {
        permissions: true,
      },
    });

    return KtqResponse.toPagination<KtqAdmin>(data, true, KtqAdmin);
  }

  async delete(id: KtqAdmin['id']) {
    const admin = await this.ktqAdminRepo.findOne({ where: { id } });

    if (!admin)
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: 'Admin is not found',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    if (admin.is_system_account) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't delete this account",
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );
    }

    await this.ktqAdminRepo.delete({ id: admin.id });

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqAdmin['id'][], request: Request) {
    const curAdmin = request['admin'];

    let newIds = ids;

    if (curAdmin) {
      newIds = ids.filter((item) => item !== curAdmin?.id);
    }

    const result = await this.ktqAdminRepo.delete({
      id: In(ids),
      is_system_account: false,
    });

    if (!result.affected) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: 'No items have been deleted yet.',
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );
    }

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async create({
    password,
    ...data
  }: Omit<
    KtqAdmin,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'is_system_account'
    | 'permissions'
    | 'posts'
  >) {
    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = await this.ktqAdminRepo.save({
      ...data,
      password: hashPassword,
    });

    if (!newAdmin)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't create account",
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );

    return KtqResponse.toResponse(true, { message: 'Create success' });
  }

  async grantNewPassword(
    id: KtqAdmin['id'],
    password: string,
    request: Request,
  ) {
    const hashPassword = await bcrypt.hash(password, 10);

    const admin = request['admin'];

    if (admin && admin.id == id) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message:
            'This future not support for this account, Please use change password !',
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );
    }

    const result = await this.ktqAdminRepo.update(id, {
      password: hashPassword,
    });

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't create account",
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );

    return KtqResponse.toResponse(true, { message: 'Grant success' });
  }

  async update(
    id: KtqAdmin['id'],
    { permissions, ...data }: Partial<KtqAdmin>,
  ) {
    try {
      const admin = await this.ktqAdminRepo.findOne({ where: { id } });

      if (!admin)
        throw new NotFoundException(
          KtqResponse.toResponse(false, {
            message: 'Admin is not found',
            status_code: HttpStatus.NOT_FOUND,
          }),
        );

      if (data.email) {
        const isDuplicateAdmin = await this.ktqAdminRepo.findOne({
          where: { email: data.email, id: Not(id) },
        });

        if (isDuplicateAdmin) {
          throw new BadRequestException(
            KtqResponse.toResponse(false, {
              message: 'Email is already exits!',
              status_code: HttpStatus.BAD_REQUEST,
            }),
          );
        }
      }

      if (permissions) {
        const permissionIds = permissions.map((p) => p.id);
        const permissionsData = await this.ktqPermissionRepo.findBy({
          id: In(permissionIds),
        });

        admin.permissions = permissionsData;
      }

      if (data.fullname) {
        admin.fullname = data.fullname;
      }

      await this.ktqAdminRepo.save(admin);

      return KtqResponse.toResponse(true, { message: 'Update success !' });
    } catch (error) {
      throw new BadRequestException(
        KtqResponse.toResponse(null, {
          message: error.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    }
  }
}
