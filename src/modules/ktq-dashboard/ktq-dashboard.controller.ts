import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KtqDashboardService } from './ktq-dashboard.service';
import { CreateKtqDashboardDto } from './dto/create-ktq-dashboard.dto';
import { UpdateKtqDashboardDto } from './dto/update-ktq-dashboard.dto';

@Controller('admin/dashboards')
export class KtqDashboardController {
  constructor(private readonly ktqDashboardService: KtqDashboardService) {}

  @Get()
  async index() {
    return this.ktqDashboardService.index();
  }
}
