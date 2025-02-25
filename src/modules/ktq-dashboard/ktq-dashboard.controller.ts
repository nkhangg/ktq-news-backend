import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KtqDashboardService } from './ktq-dashboard.service';
import { CreateKtqDashboardDto } from './dto/create-ktq-dashboard.dto';
import { UpdateKtqDashboardDto } from './dto/update-ktq-dashboard.dto';

@Controller('ktq-dashboard')
export class KtqDashboardController {
  constructor(private readonly ktqDashboardService: KtqDashboardService) {}

  @Post()
  create(@Body() createKtqDashboardDto: CreateKtqDashboardDto) {
    return this.ktqDashboardService.create(createKtqDashboardDto);
  }

  @Get()
  findAll() {
    return this.ktqDashboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ktqDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKtqDashboardDto: UpdateKtqDashboardDto) {
    return this.ktqDashboardService.update(+id, updateKtqDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ktqDashboardService.remove(+id);
  }
}
