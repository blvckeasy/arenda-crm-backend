import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ContractPayment,
  CoreContractService,
  ErrorCodeEnum,
  JwtGuard,
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

    const foundProduct = await this.productService.getById({
      id: body.product_id,
    });

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
      paymentDay: body.paymentDay,
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
    const monthlyDates = await this.dateUtil.getMonthlyDates(
      this.dateUtil.getFirstDateOfMonth(createdContract.startDate),
      this.dateUtil.getNextDate(
        createdContract.startDate,
        foundSchedules.reduce((a, s) => a + s.monthNumber, 0),
        'month',
      ),
      body.paymentDay,
    );

    // Sanalarni kuzatish uchun indeks
    let dateIndex = 0;

    await Promise.all(
      foundSchedules.map(async (schedule) => {
        const updated = await this.contractScheduleService.update(
          { id: schedule.id },
          {
            contract: {
              connect: {
                id: createdContract.id,
              },
            },
          },
        );

        for (let i = 1; i <= schedule.monthNumber; i++) {
          // monthlyDates dan sanani indeks orqali olamiz
          const paymentDateString = monthlyDates[dateIndex];

          const payment = await this.contractPaymentService.create({
            contract: { connect: { id: createdContract.id } },
            dueAmount: schedule.amount,
            dueDate: this.dateUtil.stringToDate(paymentDateString),
          });

          payments.push(payment);

          // Keyingi to'lovga o'tish uchun indeksni oshiramiz
          dateIndex++;
        }

        return updated;
      }),
    );

    // productni ham statusini arendaga berilgan qilish kerak
    const product = await this.productService.update(foundProduct.id, {
      status: ProductStatus.RENTED,
    });

    return { ...createdContract, product };
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

    return {
      contractsFullInfo,
      utility: {
        today: new Date().toLocaleDateString(),
      },
    };
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
