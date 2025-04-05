import { Controller } from '@nestjs/common';
import { KtqUsersService } from '../services/ktq-users.service';

@Controller('ktq-users')
export class KtqUsersController {
  constructor(private readonly ktqUsersService: KtqUsersService) {}
}
