import { HasExistedValidator } from '@/system/validators/has-existed.validator';
import { IsUniqueValidator } from '@/system/validators/is-unique.validator';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [IsUniqueValidator, HasExistedValidator],
  exports: [IsUniqueValidator, HasExistedValidator],
})
export class KtqAppValidatorsModule {}
