import { ContractError, ContractPaymentError, CoreContractScheduleService, ErrorCodeEnum, JwtGuard, PaymentStatus, PermissionError, RecordStatus } from "@blvckeasy/arenda-crm-core";
import { Controller, Get, UseGuards, Request, Param, ParseIntPipe, Inject, forwardRef, Post, Body, Patch, Query, UsePipes } from "@nestjs/common";
import { ContractPaymentService, ContractService } from "../services";
import { CreateContractPaymentDto, PayWithAmountDto, UpdateContractPaymentDto } from "../dto";
import { FilterByIdDto, IncludeQueryParamDto, ParseQueryPipe, RequestQueryBuilder } from "../../../common";


@Controller('contract-payment')
export class ContractPaymentController {
  constructor (
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,

    // private readonly contractScheduleService: ContractScheduleService,

    @Inject(forwardRef(() => CoreContractScheduleService))
    private readonly coreContractScheduleService: CoreContractScheduleService,

    private readonly contractPaymentService: ContractPaymentService,

    private readonly requestQueryBuilder: RequestQueryBuilder,
  ) {}

  @UseGuards(JwtGuard)
  @UsePipes(
    new ParseQueryPipe({
      includeString: IncludeQueryParamDto,
    }),
  )
  @Get(':contract_id')
  async get(
    @Request() req,
    @Param('contract_id', ParseIntPipe) contract_id: number,
    @Query()
        {
          includeString,
        }: {
          includeString: IncludeQueryParamDto;
        },
  ) {
    const include = this.requestQueryBuilder.buildIncludeParam(includeString);

    const user = req.user;

    const contract = await this.contractService.getById({ id: contract_id }, include);

    // permission tekshirilgan shu shartnoma aynan shu odamga tegishlimi yo'qmi
    if (contract.ownerId !== user.id) {
      throw new PermissionError(ErrorCodeEnum.USER_HAS_NO_PERMISSIONS);
    }

    const schedules = await this.coreContractScheduleService.list(undefined, {
      contractId: contract.id,
      recordStatus: RecordStatus.ACTIVE,
    });

    const payments = await this.contractPaymentService.list({
      contractId: contract.id,
      recordStatus: RecordStatus.ACTIVE,
    }, undefined, {
      field: 'dueDate',
      direction: 'asc',
    })

    return ({
      contract,
      schedules,
      payments,
    })
  }

  @UseGuards(JwtGuard)
  @Post('create')
  async create(
    @Request() req,
    @Body() dto: CreateContractPaymentDto,
  ) {
    const user = req.user;
    const contract = await this.contractService.getById({ id: dto.contractId });

    const newPayment = await this.contractPaymentService.create({
      dueAmount:  dto.dueAmount,
      paidAmount: dto.paidAmount,
      dueDate: dto.dueDate,
      paidAt: dto.paidAt,
      contract: {
        connect: {
          id: contract.id,
        }
      },
      status: dto.dueAmount === dto.paidAmount ? PaymentStatus.PAID : PaymentStatus.PARTIALLY_PAID
    });

    return newPayment;
  }

  @UseGuards(JwtGuard)
  @Patch('update')
  async update (
    @Request() req,
    @Query() filter: FilterByIdDto,
    @Body() dto: UpdateContractPaymentDto,
  ) {
    const user = req.user;

    const payment = await this.contractPaymentService.getById({ id: filter.id });

    const contract = await this.contractService.getById({ id: payment.contractId });

    const today = new Date();

    if (contract.ownerId !== user.id) {
      throw new PermissionError(ErrorCodeEnum.PERMISSION_DENIED);
    }

    if (dto.paidAmount && dto.paidAmount > payment.dueAmount) {
      throw new ContractPaymentError(ErrorCodeEnum.OVERPAYMENT)
    }

    if (dto.paidAmount && dto.paidAmount == payment.dueAmount) {
      dto.status = PaymentStatus.PAID;
    }

    if (dto.paidAmount && dto.paidAmount !== 0 && dto.paidAmount < payment.dueAmount) {
      dto.status = PaymentStatus.PARTIALLY_PAID;
    }

    if (dto?.paidAmount == 0) {
      dto.status = PaymentStatus.PENDING;
    }
    
    if (dto.status == PaymentStatus.PENDING && today > payment.dueDate) {
      dto.status = PaymentStatus.OVERDUE;
    }

    const updated = await this.contractPaymentService.update(payment.id, dto);

    return updated;
  }

  @Patch('pay/:contractId')
  async payMultipleBalances (
    @Param('contractId', ParseIntPipe) contractId: number,
    @Body() body: PayWithAmountDto,
  ) {
    let { paidAmount, paidDate } = body;

    const contract = await this.contractService.getById({ id: contractId });

    if (!contract) {
      throw new ContractError(ErrorCodeEnum.NOT_FOUND);
    }
    const payments = await this.contractPaymentService.list(
        { contractId }, 
        undefined, 
        { field: 'dueDate', direction: "asc" }
    );

    for (const payment of payments) {
        if (paidAmount === 0) break;
        if (payment.status == PaymentStatus.PAID) continue;

        const amount = payment.dueAmount - payment.paidAmount;

        if (amount > paidAmount) {
            payment.status = PaymentStatus.PARTIALLY_PAID;
            payment.paidAmount += paidAmount;
            paidAmount = 0;
        } else {
            payment.status = PaymentStatus.PAID;
            payment.paidAmount += amount;
            paidAmount -= amount;
        }

        payment.paidAt = new Date(paidDate);

        await this.contractPaymentService.update(payment.id, payment);
    }

    return payments;
  }
}