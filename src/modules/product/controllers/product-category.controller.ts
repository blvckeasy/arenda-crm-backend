import { CoreProductCategoryService } from '@blvckeasy/arenda-crm-core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SortDto, PaginationDto, ParseQueryPipe } from '../../../common';
import { CreateProductCategoryDto, FilterByIdDto, GetProductCategoryDto, UpdateProductCategoryBodyDto } from '../dto';
import { ProductCategoryService } from '../services';
import { RecordStatus } from '@blvckeasy/arenda-crm-core';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly coreProductCategoryService: CoreProductCategoryService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateProductCategoryDto) {
    const created = await this.coreProductCategoryService.create(body);
    return created;
  }

  @Get('list')
  @UsePipes(
    new ParseQueryPipe({
      pagination: PaginationDto,
      sort: SortDto,
      filter: GetProductCategoryDto,
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
      filter: GetProductCategoryDto;
      sort: SortDto;
    },
  ) {
    const categories = await this.coreProductCategoryService.list(
      pagination,
      filter,
      { field: sort.sortField, direction: sort.sortOrder },
    );
    return categories;
  }

  @Patch('update')
  async update(
    @Query() filter: FilterByIdDto,
    @Body() body: UpdateProductCategoryBodyDto,
  ) {
    const updated = await this.coreProductCategoryService.update(
      filter.id,
      body,
    );
    return updated;
  }

  @Delete('delete')
  async delete(@Query() filter: FilterByIdDto) {
    const deleted = await this.coreProductCategoryService.update(
      filter.id,
      { status: RecordStatus.DELETED },
    );
    return deleted;
  }
}
