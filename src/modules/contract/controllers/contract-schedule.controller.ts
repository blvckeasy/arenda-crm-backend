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
    ContractError,
  ContractScheduleError,
  CoreContractScheduleService,
  ErrorCodeEnum,
  RecordStatus,
} from '@blvckeasy/arenda-crm-core';
import { CreateContractScheduleDto, UpdateContractScheduleDto } from '../dto';
import { FilterByIdDto } from '../../../common';
import { CONTRACT_SCHEDULES_CONSTANTS } from '../../../common/constant/contract.constant';

@Controller('contract-schedule')
export class ContractScheduleController {
  constructor(
    private readonly coreContractScheduleService: CoreContractScheduleService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateContractScheduleDto) {
    const { monthNumber } = body;

    if (monthNumber > CONTRACT_SCHEDULES_CONSTANTS.MAX_SCHEDULES) {
        throw new ContractScheduleError(
            ErrorCodeEnum.ERR_CONTRACT_SCHEDULES_MAX_MONTH_NUMBER
        );
    }

    if (monthNumber < CONTRACT_SCHEDULES_CONSTANTS.MIN_SCHEDULES) {
        throw new ContractScheduleError(
            ErrorCodeEnum.ERR_CONTRACT_SCHEDULES_MIN_MONTH_NUMBER
        );
    }

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
