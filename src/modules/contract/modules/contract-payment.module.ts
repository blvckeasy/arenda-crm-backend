import {
  AccessTokenModule,
  CoreContractPaymentModule,
  CoreContractScheduleModule,
} from '@blvckeasy/arenda-crm-core';
import { forwardRef, Module } from '@nestjs/common';
import { ContractPaymentService } from '../services';
import { ContractPaymentController } from '../controllers';
import { ContractModule } from './contract.module';

@Module({
  imports: [
    CoreContractPaymentModule,
    forwardRef(() => CoreContractScheduleModule),
    forwardRef(() => ContractModule),
    AccessTokenModule,
  ], // AccessTokenModule JwtGuard uchun import qilingan
  controllers: [ContractPaymentController],
  providers: [ContractPaymentService],
  exports: [ContractPaymentService],
})
export class ContractPaymentModule {}
