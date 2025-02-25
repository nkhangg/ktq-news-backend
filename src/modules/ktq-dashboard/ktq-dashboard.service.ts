import { Injectable } from '@nestjs/common';
import { CreateKtqDashboardDto } from './dto/create-ktq-dashboard.dto';
import { UpdateKtqDashboardDto } from './dto/update-ktq-dashboard.dto';

@Injectable()
export class KtqDashboardService {
  create(createKtqDashboardDto: CreateKtqDashboardDto) {
    return 'This action adds a new ktqDashboard';
  }

  findAll() {
    return `This action returns all ktqDashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ktqDashboard`;
  }

  update(id: number, updateKtqDashboardDto: UpdateKtqDashboardDto) {
    return `This action updates a #${id} ktqDashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} ktqDashboard`;
  }
}
