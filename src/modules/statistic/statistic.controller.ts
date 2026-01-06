import { ContractStatus, CoreContractPaymentService, CoreContractScheduleService, CoreContractService, JwtGuard, PaymentStatus, RecordStatus } from "@blvckeasy/arenda-crm-core";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";

@Controller({
  path: 'statistics'
})
export class StatisticController {

  constructor (
    private readonly coreContractService: CoreContractService,
    private readonly coreContractSchedulesService: CoreContractScheduleService,
    private readonly coreContractPaymentService: CoreContractPaymentService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('balance-info')
  async getBalance(
    @Req() req,
  ) {
    const contracts = await this.coreContractService.list(undefined, { ownerId: req.user.id });
    const balance = {
      paid: 0,
      overdue: 0,
    };

    for (const contract of contracts) {
      const payments = await this.coreContractPaymentService.list(undefined, { contractId: contract.id });

      payments.forEach((payment) => {
        balance.paid += payment.paidAmount;
        balance.overdue += payment.dueAmount - payment.paidAmount;
      });
    }

    return {
      balance,
    };
  }

  @UseGuards(JwtGuard)
  @Get('contracts-info')
  async getContractsInfo(
    @Req() req,
  ) {
    const contracts = await this.coreContractService.list(undefined, { ownerId: req.user.id });
    const contractsInfo = {
      all: 0,
      active: 0,
      complated: 0,
      cancelled: 0,
    };

    contracts.forEach((contract) => {
      contractsInfo['all'] += 1;
      contractsInfo[contract.contractStatus.toLocaleLowerCase()] += 1;
    });

    return {
      contracts: contractsInfo,
    }
  }
}