import { Injectable } from '@nestjs/common';
import { FilterByIdDto } from '../../../common';
import { Contract, ContractError, CoreContractService, ErrorCodeEnum } from '@blvckeasy/arenda-crm-core';

@Injectable()
export class ContractService {

  constructor (
    private readonly coreContractService: CoreContractService,
  ) {}

  async getById(filter: FilterByIdDto): Promise<Contract> {
    const found = await this.coreContractService.getByUnique(filter);
    
    if (!found) {
      throw new ContractError(ErrorCodeEnum.NOT_FOUND);
    }

    return found;
  }
}
