import { Module } from "@nestjs/common";
import { AccessTokenModule, CoreContractModule, CoreContractPaymentModule, CoreContractScheduleModule } from "@blvckeasy/arenda-crm-core";
import { AuthModule } from "../auth";
import { StatisticController } from "./statistic.controller";
import { StatisticService } from "./statistic.service";

@Module({
  imports: [
    AuthModule,
    AccessTokenModule,
    CoreContractModule,
    CoreContractScheduleModule,
    CoreContractPaymentModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [],
})
export class StatisticModule {}