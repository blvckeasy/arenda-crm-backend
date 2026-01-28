import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ContractPaymentService } from '../../contract/services';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractPayment, PaymentStatus } from '@blvckeasy/arenda-crm-core';

@Injectable()
export class ContractPaymentJobs {
  constructor(
    @Inject(forwardRef(() => ContractPaymentService))
    private contractPaymentService: ContractPaymentService,
  ) {}

  // BU cron job qarzdorliklarni aniqlaydi
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleContractPaymentOverdueStatusCron() {
    const today = new Date();
    const expiredContractPayments = await this.contractPaymentService.list({
      dueDate: { lte: today, },
      NOT: {
        status: {
          in: ['PAID', 'PARTIALLY_PAID'],
        }
      }
    });

    expiredContractPayments.forEach(
      async (contractPayment: ContractPayment) => {
          await this.contractPaymentService.update(contractPayment.id, {
            status: PaymentStatus.OVERDUE,
          });
      },
    );
  }

  // // BU cron job ozginasi to'langanlarini aniqlaydi
  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async handleContractPaymentStatusCron() {
  //   const today = new Date();
  //   const expiredContractPayments = await this.contractPaymentService.list({
  //     dueDate: { lte: today, },
  //     NOT: {
  //       status: {
  //         in: ['PAID', 'PARTIALLY_PAID'],
  //       }
  //     }
  //   });

  //   expiredContractPayments.forEach(
  //     async (contractPayment: ContractPayment) => {
  //         await this.contractPaymentService.update(contractPayment.id, {
  //           status: PaymentStatus.OVERDUE,
  //         });
  //     },
  //   );
  // }
}
