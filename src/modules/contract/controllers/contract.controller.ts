import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
	ContractError,
  ContractPayment,
  CoreContractService,
  CoreProductService,
  ErrorCodeEnum,
  JwtGuard,
  PaymentStatus,
  ProductError,
  ProductStatus,
  RecordStatus,
  UserRoles,
} from '@blvckeasy/arenda-crm-core';
import {
  RequestQueryBuilder,
  FilterByIdDto,
  IncludeQueryParamDto,
  PaginationDto,
  ParseQueryPipe,
  SortDto,
  DateUtil,
} from '../../../common';
import { CreateContractDto, GetContractDto, UpdateContractDto } from '../dto';
import { CustomerService } from '../../customer';
import { ContractPaymentService, ContractScheduleService } from '../services';
import { ProductService } from '../../product';

@Controller('contract')
export class ContractController {
  constructor(
    private readonly coreContractService: CoreContractService,
    private readonly customerService: CustomerService,
    private readonly contractScheduleService: ContractScheduleService,

    @Inject(forwardRef(() => ContractPaymentService))
    private readonly contractPaymentService: ContractPaymentService,

    private readonly productService: ProductService,

		@Inject(forwardRef(() => CoreProductService))
		private readonly coreProductService: CoreProductService,

    private readonly requestQueryBuilder: RequestQueryBuilder,
    private readonly dateUtil: DateUtil,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() body: CreateContractDto) {
    // kreditorniyam found qilib tekshirish kerak...

    // bu joyda hamma found bilan boshlangan variablelarda agar malumot topilmasa throw Error qaytaradi... Tipa validation uchun yozilgan
    const foundCustomer = await this.customerService.getById({
      id: body.customer_id,
    });

    let foundProduct = await this.productService.getById({
      id: body.product_id,
    });

		const contractProductIdsCount = await this.coreContractService.countDocumentsByFilter({ productId: foundProduct.id });

		if (contractProductIdsCount >= foundProduct.count) {
			throw new ProductError(ErrorCodeEnum.ALL_PRODUCTS_ARE_RENTED);
		}

    if (foundProduct.status !== ProductStatus.ACTIVE) {
      throw new ProductError(ErrorCodeEnum.RECORD_IS_NOT_ACTIVE);
    }

    const foundSchedules = await Promise.all(
      body.schedules_id.map(async (id) => {
        const schedule = await this.contractScheduleService.getById({ id });
        return schedule;
      }),
    );

    const createdContract = await this.coreContractService.create({
      startDate: body.startDate,
      endDate: body.endDate,
      agreedPrice: body.agreedPrice,
      yearPercent: body.yearPercent,
      initialPayment: body.initialPayment,
      totalPrice: body.totalPrice,
      firstPaymentDate: body.firstPaymentDate,
      owner: {
        connect: {
          id: req.user.id,
        },
      },
      customer: {
        connect: {
          id: foundCustomer.id,
        },
      },
      product: {
        connect: {
          id: foundProduct.id,
        },
      },
      schedules: {
        connect: foundSchedules.map((schedule) => {
          return { id: schedule.id };
        }),
      },
    });

    const payments: ContractPayment[] = [];
    const lastPaymentDate: Date = this.dateUtil.getNextDate(
      body.firstPaymentDate,
      foundSchedules.reduce((a, s) => a + s.monthNumber, 0),
      'month',
    );

    const monthlyDates = await this.dateUtil.getMonthlyDates(
      body.firstPaymentDate,
      lastPaymentDate,
      body.firstPaymentDate.getDate(),
    );

    // Sanalarni kuzatish uchun indeks
    let dateIndex = 0;

    for (let j in foundSchedules) {
      foundSchedules[j] = await this.contractScheduleService.update(
        { id: foundSchedules[j].id },
        {
          contract: {
            connect: {
              id: createdContract.id,
            },
          },
        },
      );

      for (let i = 1; i <= foundSchedules[j].monthNumber; i++) {
        // monthlyDates dan sanani indeks orqali olamiz
        const paymentDateString = monthlyDates[dateIndex];
        const paymentDate = this.dateUtil.stringToDate(paymentDateString);

        const today = new Date();
        const status = today > paymentDate ? PaymentStatus.OVERDUE : PaymentStatus.PENDING;

        const payment = await this.contractPaymentService.create({
          contract: { connect: { id: createdContract.id } },
          status,
          dueAmount: foundSchedules[j].amount,
          dueDate: paymentDate,
        });

        payments.push(payment);

        // Keyingi to'lovga o'tish uchun indeksni oshiramiz
        dateIndex++;
      }
    }

		const productContractsCount = await this.coreProductService.countDocumentsByFilter({ id: foundProduct.id });

		// agar productga tegishli contractlar soni product count ga teng bo'lsa product statusini RENTED ga o'zgartiramiz
		if (productContractsCount >= foundProduct.count) {
			foundProduct = await this.coreProductService.update(foundProduct.id, {
				status: ProductStatus.RENTED,
			});
		}

    return { ...createdContract, product: foundProduct };
  }

  @Get('list')
  @UseGuards(JwtGuard)
  @UsePipes(
    new ParseQueryPipe({
      pagination: PaginationDto,
      filter: GetContractDto,
      sort: SortDto,
      includeString: IncludeQueryParamDto,
    }),
  )
  async list(
    @Req() req,
    @Query()
    {
      pagination,
      filter,
      sort,
      includeString,
    }: {
      pagination: PaginationDto;
      filter: GetContractDto;
      sort: SortDto;
      includeString: IncludeQueryParamDto;
    },
  ) {
    const include = this.requestQueryBuilder.buildIncludeParam(includeString);

    const contracts = await this.coreContractService.list(
      pagination,
      {
        ...filter,
        ownerId: req.user.role == UserRoles.CREDITOR ? req.user.id : undefined, // agar kreditor bo'lsa u o'zining malumotlarini ko'ra olishi kerak boshqalarnikini emas. Agar admin bo'lsa u holatda ko'ra oladi shu uchun undefined qilib ketilgan.
      },
      {
        field: sort.sortField,
        direction: sort.sortOrder,
      },
      include,
    );

    const contractsFullInfo = await Promise.all(
      contracts.map(async (c) => {
        const schedules = await this.contractScheduleService.list({
          contractId: c.id,
          recordStatus: { equals: RecordStatus.ACTIVE },
        });
        const payments = await this.contractPaymentService.list(
          { contractId: c.id, recordStatus: { equals: RecordStatus.ACTIVE } },
          undefined,
          { field: 'dueDate', direction: 'asc' },
        );
        return {
          ...c,
          schedules,
          payments,
        };
      }),
    );

		const count = await this.coreContractService
			.countDocumentsByFilter(filter);

    return {
      contractsFullInfo,
			meta: {
				total: count,
        pagesCount: Math.ceil(count / pagination.size),
        currentPage: pagination.page,
        size: pagination.size,
			},
      utility: {
        today: new Date().toLocaleDateString(),
      },
    };
  }

	@Get('balance-info/:contractId')
	async getContractBalanceInfo (
		@Param('contractId') contractId: number,
	) {
		const contract = await this.coreContractService.getByUnique({ id: contractId });

		if (!contract) {
			throw new ContractError(ErrorCodeEnum.NOT_FOUND);
		}

		const payments = await this.contractPaymentService.list({ contractId });

		const balance = {
			contractAmount: contract.totalPrice,  // shartnoma summasi
			overdue: 0,         									// umumiy qarzdorlik
			currentDebt: 0,     									// joriy qarzdorlik
			paid: 0,         											// to‘langan summa
		};

		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);

		for (const payment of payments) {
			switch (payment.status) {

				case PaymentStatus.OVERDUE:
				case PaymentStatus.PENDING:
					if (today >= payment.dueDate) {
						balance.currentDebt += payment.dueAmount;
					}

					break;
				
				case PaymentStatus.PAID:
					balance.paid += payment.dueAmount;
					break;

				case PaymentStatus.PARTIALLY_PAID:
					const overdueAmount = payment.dueAmount - payment.paidAmount;

					balance.paid += payment.paidAmount;
					balance.overdue += overdueAmount;

					if (today >= payment.dueDate) {
						balance.currentDebt += overdueAmount;
					}
					break;
			}
		}

		balance.overdue = contract.totalPrice - balance.paid;

		return balance;
	}

  @Patch('update')
  @UseGuards(JwtGuard)
  async update(
    @Query() filter: FilterByIdDto,
    @Body() body: UpdateContractDto,
  ) {
    const updatedContract = await this.coreContractService.update(
      filter.id,
      body,
    );
    return updatedContract;
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  async delete(@Query() filter: FilterByIdDto) {
    const deletedContract = await this.coreContractService.update(filter.id, {
      recordStatus: RecordStatus.DELETED,
    });
    return deletedContract;
  }
}
