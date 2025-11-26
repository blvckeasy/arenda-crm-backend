import { Body, Controller, Post, Request, Delete, Get, Headers, Patch, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CoreProductService, JwtGuard, RecordStatus, UserRoles } from '@blvckeasy/arenda-crm-core';
import { CreateProductDto, GetProductDto, UpdateProductDto } from '../dto';
import { FilterByIdDto, IncludeQueryParamDto, PaginationDto, ParseQueryPipe, RequestQueryBuilder, SortDto } from '../../../common';
import { ProductCategoryService } from '../services';

@Controller('product')
export class ProductController {
  constructor(
    private readonly coreProductService: CoreProductService,
    private readonly productCategoryService: ProductCategoryService,

    private readonly requestQueryBuilder: RequestQueryBuilder,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async create(
    @Request() req,
    @Headers('authorization') authorization: string,
    @Body() body: CreateProductDto,
  ) {
    const foundCategory = await this.productCategoryService.getById({ id: body.category });

    const newProduct = await this.coreProductService.create({
      ...body,
      owner: {
        connect: {
          id: req.user.id as number,
        },
      },
      category: {
        connect: {
          id: foundCategory.id,
        },
      }
    });
    
    return newProduct;
  }

  @Get('list')
  @UsePipes(
    new ParseQueryPipe({
      pagination: PaginationDto,
      sort: SortDto,
      filter: GetProductDto,
      includeString: IncludeQueryParamDto,
    }),
  )
  @UseGuards(JwtGuard)
  async list(
    @Request() req,
    @Query()
    {
      pagination,
      filter,
      sort,
      includeString,
    }: {
      pagination: PaginationDto;
      filter: GetProductDto;
      sort: SortDto;
      includeString: IncludeQueryParamDto;
    },
  ) {
    const include = this.requestQueryBuilder.buildIncludeParam(includeString);

    const products = await this.coreProductService.list(
      pagination, 
      {
        ...filter,
        category: filter.categoryId ? { is: { id: filter.categoryId } } : undefined,
        ownerId: req.user.role == UserRoles.CREDITOR ? req.user.id : undefined, // agar kreditor bo'lsa u o'zining malumotlarini ko'ra olishi kerak boshqalarnikini emas. Agar admin bo'lsa u holatda ko'ra oladi shu uchun undefined qilib ketilgan.
      }, 
      { 
        field: sort.sortField, 
        direction: sort.sortOrder 
      },
      include,
    );
    const count = await this.coreProductService
      .countDocumentsByFilter(filter);

    return {
      items: products,
      meta: {
        total: count,
        page: pagination.page,
        size: pagination.size,
      }
    };
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  async update(
    @Query() filter: FilterByIdDto,
    @Body() body: UpdateProductDto,
  ) {
    const updated = await this.coreProductService.update(filter.id, {
      ...body,
      category: body.category ? {
        connect: {
          id: body.category,
        },
      } : undefined,
    });
    return updated;
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  async delete(@Query() filter: FilterByIdDto) {
    const deleted = await this.coreProductService.update(
      filter.id,
      { recordStatus: RecordStatus.DELETED },
    );
    return deleted;
  }
}
