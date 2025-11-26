import { CoreCustomerService, Customer, CustomerError, CustomerErrorCode, ErrorCodeEnum } from '@blvckeasy/arenda-crm-core';
import { Injectable } from '@nestjs/common';
import { GetCustomerDto } from './dto';
import { FilterByIdDto } from '../../common';

@Injectable()
export class CustomerService {
  constructor (
    private readonly coreCustomerService: CoreCustomerService,
  ) {}

  async getById(filter: FilterByIdDto): Promise<Customer> {
    const found = await this.coreCustomerService.getByUnique(filter);
    if (!found) {
      throw new CustomerError(ErrorCodeEnum.NOT_FOUND);
    }
    return found;
  }
}
