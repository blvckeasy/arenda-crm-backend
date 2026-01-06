import { Injectable } from '@nestjs/common';
import { FilterByIdDto } from '../../../common';
import { Contract, ContractError, CoreContractService, ErrorCodeEnum, Prisma } from '@blvckeasy/arenda-crm-core';

@Injectable()
export class ContractService {

  constructor (
    private readonly coreContractService: CoreContractService,
  ) {}

  async getById(filter: FilterByIdDto, include?: Prisma.ContractInclude): Promise<Contract> {
    const found = await this.coreContractService.getByUnique(filter, include);
    
    if (!found) {
      throw new ContractError(ErrorCodeEnum.NOT_FOUND);
    }

    return found;
  }
}
