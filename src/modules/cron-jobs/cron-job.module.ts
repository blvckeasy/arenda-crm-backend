import { forwardRef, Module } from "@nestjs/common";
import { ContractPaymentJobs } from "./jobs";
import { ContractPaymentModule } from "../contract/modules/contract-payment.module";

@Module({
  imports: [forwardRef(() => ContractPaymentModule)],
  providers: [ContractPaymentJobs],
})
export class CronJobModule {}