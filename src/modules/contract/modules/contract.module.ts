import { forwardRef, Module } from '@nestjs/common';
import { AccessTokenModule, CoreContractModule, CoreProductModule } from '@blvckeasy/arenda-crm-core';
import { ContractController } from '../controllers';
import { ContractService } from '../services';
import { CustomerModule } from '../../customer';
import { ContractScheduleModule } from './contract-schedule.module';
import { ProductModule } from '../../product';
import { ContractPaymentModule } from './contract-payment.module';
import { DateUtil, RequestQueryBuilder } from '../../../common';

@Module({
  imports: [
    CoreContractModule, 
    CustomerModule, 
    ContractScheduleModule, 
    forwardRef(() => ContractPaymentModule), 
    forwardRef(() => CoreProductModule),
    ProductModule, 
    AccessTokenModule
],
  controllers: [ContractController],
  providers: [ContractService, RequestQueryBuilder, DateUtil],
  exports: [ContractService],
})
export class ContractModule {}
