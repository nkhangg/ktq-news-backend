import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KtqUser } from '../entities/ktq-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KtqUsersService {
  constructor(
    @InjectRepository(KtqUser)
    readonly ktqUserRepo: Repository<KtqUser>,
  ) {}
}
