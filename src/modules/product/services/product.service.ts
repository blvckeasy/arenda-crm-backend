import { Injectable } from '@nestjs/common';
import { FilterByIdDto } from '../dto';
import { Prisma, CoreProductService, ErrorCodeEnum, Product, ProductError } from '@blvckeasy/arenda-crm-core';

@Injectable()
export class ProductService {
  constructor (
    private coreProductService: CoreProductService,
  ) {}

  async getById(filter: FilterByIdDto): Promise<Product> {
    const found = await this.coreProductService.getById(filter.id);
    if (!found) {
      throw new ProductError(ErrorCodeEnum.NOT_FOUND);
    }
    return found;
  }

  async update(id: number, input: Prisma.ProductUpdateInput): Promise<Product> {
    const updated = await this.coreProductService.update(id, input);
    return updated;
  }
}
