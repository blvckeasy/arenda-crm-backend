import { Injectable } from '@nestjs/common';
import { FilterByIdDto } from '../../../common';
import { ContractSchedule, CoreContractScheduleService, ContractScheduleError, ErrorCodeEnum, Prisma, Pagination, Sort } from '@blvckeasy/arenda-crm-core';

@Injectable()
export class ContractScheduleService {
  constructor (
    private readonly coreContractScheduleService: CoreContractScheduleService,
  ) {}

  async getById(filter: FilterByIdDto): Promise<ContractSchedule> {
    const found = await this.coreContractScheduleService.getByUnique(filter);
    if (!found) {
      throw new ContractScheduleError(ErrorCodeEnum.NOT_FOUND);
    }
    return found;
  }

  async update(filter: FilterByIdDto, body: Prisma.ContractScheduleUpdateInput) {
    const updated = await this.coreContractScheduleService.update(filter.id, body);
    return updated;
  }

  async list(filter?: Prisma.ContractScheduleWhereInput, pagination?: Pagination, sort?: Sort) {
    const found = await this.coreContractScheduleService.list(pagination, filter, sort);
    return found;
  }
}
