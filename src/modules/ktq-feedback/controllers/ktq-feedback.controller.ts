import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqFeedbackService } from '../ktq-feedback.service';
import { KtqFeedback } from '../entities/ktq-feedback.entity';
import { DeletesDto } from '../dto/deletes.dto';

@Controller('admin/feedbacks')
export class KtqFeedbackController {
  constructor(private readonly ktqFeedbackService: KtqFeedbackService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqFeedbackService.index(query);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqFeedback['id']) {
    return await this.ktqFeedbackService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto) {
    return await this.ktqFeedbackService.deletes(data.ids);
  }
}
