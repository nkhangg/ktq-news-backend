import KtqResponse from '@/system/response/ktq-response';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { In, Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { KtqFeedback } from './entities/ktq-feedback.entity';

@Injectable()
export class KtqFeedbackService {
  constructor(
    @InjectRepository(KtqFeedback)
    readonly ktqFeedback: Repository<KtqFeedback>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqFeedback> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      fullname: [FilterOperator.ILIKE],
      email: [FilterOperator.ILIKE],
      message: [FilterOperator.ILIKE],
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqFeedback, {
      sortableColumns: ['id', 'email', 'message', 'fullname'],
      searchableColumns: ['id', 'email', 'message', 'fullname'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqFeedback>(data, true, KtqFeedback);
  }

  async create({ email, ...data }: CreateDto) {
    const feedback = await this.ktqFeedback.findOne({
      where: { email },
    });

    let result = null;

    if (!feedback) {
      result = await this.ktqFeedback.save({
        ...data,
        email,
      });
    } else {
      result = await this.ktqFeedback.update({ email }, { ...data });
    }

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create feedback" }),
      );

    return KtqResponse.toResponse(true);
  }

  async delete(id: KtqFeedback['id']) {
    const result = await this.ktqFeedback.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete feedback" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqFeedback['id'][]) {
    const result = await this.ktqFeedback.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete feedback" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
