import { Module } from '@nestjs/common';
import { KtqAdminsService } from './services/ktq-admins.service';
import KtqAdmin from './entities/ktq-admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqAdminsController } from './controllers/ktq-admins.controller';
import KtqPermission from './entities/ktq_permission.entity';
import { KtqPermissionService } from './services/ktq-permission.service';
import { KtqPermissionsController } from './controllers/ktq-permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KtqAdmin, KtqPermission])],
  providers: [KtqAdminsService, KtqPermissionService],
  exports: [KtqAdminsService, KtqPermissionService],
  controllers: [KtqAdminsController, KtqPermissionsController],
})
export class KtqAdminsModule {}
