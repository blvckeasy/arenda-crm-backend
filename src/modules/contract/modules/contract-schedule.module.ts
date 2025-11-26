import { Module } from '@nestjs/common';
import { CoreContractScheduleModule } from '@blvckeasy/arenda-crm-core';
import { ContractScheduleController } from '../controllers';
import { ContractScheduleService } from '../services';

@Module({
  imports: [CoreContractScheduleModule],
  controllers: [ContractScheduleController],
  providers: [ContractScheduleService],
  exports: [ContractScheduleService],
})
export class ContractScheduleModule {}
