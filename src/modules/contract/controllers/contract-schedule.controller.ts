import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CoreContractScheduleService,
  RecordStatus,
} from '@blvckeasy/arenda-crm-core';
import { CreateContractScheduleDto, UpdateContractScheduleDto } from '../dto';
import { FilterByIdDto } from '../../../common';

@Controller('contract-schedule')
export class ContractScheduleController {
  constructor(
    private readonly coreContractScheduleService: CoreContractScheduleService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateContractScheduleDto) {
    const newContractSchedule = await this.coreContractScheduleService.create({
      ...body,
      contract: body.contract_id ? {
        connect: {
          id: body.contract_id,
        },
      } : undefined,
    });

    return newContractSchedule;
  }

  @Get('get')
  async list(@Query() filter: FilterByIdDto) {
    const contractSchedules =
      await this.coreContractScheduleService.getByUnique({
        id: filter.id,
      });

    return contractSchedules;
  }

  @Patch('update')
  async update(
    @Query() filter: FilterByIdDto,
    @Body() body: UpdateContractScheduleDto,
  ) {
    const updatedContractSchedule =
      await this.coreContractScheduleService.update(filter.id, body);
    return updatedContractSchedule;
  }

  @Delete('delete')
  async delete(@Query() filter: FilterByIdDto) {
    const deletedContractSchedule =
      await this.coreContractScheduleService.update(filter.id, {
        recordStatus: RecordStatus.DELETED,
      });

    return deletedContractSchedule;
  }
}
