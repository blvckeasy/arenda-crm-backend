import { CoreCustomerModule, LocalFileUploadStorage } from '@blvckeasy/arenda-crm-core';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [CoreCustomerModule],
  controllers: [CustomerController],
  providers: [CustomerService, LocalFileUploadStorage],
  exports: [CustomerService],
})
export class CustomerModule {}
