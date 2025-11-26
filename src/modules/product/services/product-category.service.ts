import { CoreProductCategoryService, ErrorCodeEnum, ProductCategoryError } from '@blvckeasy/arenda-crm-core';
import { Injectable } from '@nestjs/common';
import { FilterByIdDto } from '../dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly coreProductCategoryService: CoreProductCategoryService,
  ) { }

  async getById(filter: FilterByIdDto) {
    const found = await this.coreProductCategoryService.getById(filter.id);
    if (!found) {
      throw new ProductCategoryError(ErrorCodeEnum.NOT_FOUND);
    }

    return found
  }
}
