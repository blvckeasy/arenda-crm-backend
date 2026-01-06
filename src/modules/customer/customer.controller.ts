import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CoreCustomerService,
  LocalFileUploadStorage,
  RecordStatus,
} from '@blvckeasy/arenda-crm-core';
import { PaginationDto, ParseQueryPipe, SortDto } from '../../common';
import { CreateCustomerDto, GetCustomerDto, UpdateCustomerDto } from './dto';
import { FilterByIdDto } from '../product/dto';


@Controller('customer')
export class CustomerController {
  constructor(
    private readonly coreCustomerService: CoreCustomerService,
    private readonly localFileUploadStorage: LocalFileUploadStorage,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('passportImg'))
  async create(@Body() body: CreateCustomerDto) {
    const newCustomer = await this.coreCustomerService.create({
      ...body,
    });

    return newCustomer;
  }

  @Get('list')
  @UsePipes(
    new ParseQueryPipe({
      pagination: PaginationDto,
      sort: SortDto,
      filter: GetCustomerDto,
    }),
  )
  async list(
    @Query()
    {
      pagination,
      filter,
      sort,
    }: {
      pagination: PaginationDto;
      filter: GetCustomerDto;
      sort: SortDto;
    },
  ) {
    const customers = await this.coreCustomerService.list(pagination, filter, {
      field: sort.sortField,
      direction: sort.sortOrder,
    });
    return customers;// Boshqa barcha string'lar uchun "contains" ishlataveramiz.
  }

  @Patch('update')
  async update(
    @Query() filter: FilterByIdDto,
    @Body() body: UpdateCustomerDto,
  ) {
    const updated = await this.coreCustomerService.update(filter.id, body);
    return updated;
  }

  @Delete('delete')
  async delete(
    @Query() filter: FilterByIdDto,
  ) {
    const deleted = await this.coreCustomerService.update(filter.id, {
      status: RecordStatus.DELETED,
    })
    return deleted;
  }
}
