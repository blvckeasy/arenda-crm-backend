import { Delete, Get, Headers, Param, Patch, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CoreProductService, JwtGuard, UserRoles } from '@blvckeasy/arenda-crm-core';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateProductDto, FilterByIdDto, GetProductDto, QueryProductIncludeDto, UpdateProductDto } from '../dto';
import { PaginationDto, ParseQueryPipe, SortDto } from '../../../common';

@Controller('product')
export class ProductController {
  constructor(private readonly coreProductService: CoreProductService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async create(
    @Request() req,
    @Headers('authorization') authorization: string,
    @Body() body: CreateProductDto,
  ) {
    const newProduct = await this.coreProductService.create({
      ...body,
      owner: {
        connect: {
          id: req.user.id as number,
        },
      },
      category: {
        connect: {
          id: body.category,
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
      includeString: QueryProductIncludeDto,
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
      includeString: QueryProductIncludeDto;
    },
  ) {
    const include = includeString?.include 
      ? Object.assign({}, ...includeString.include.split(',').map((e) => {return { [e]: true }})) 
      : undefined;

    const products = await this.coreProductService.list(
      pagination, 
      {
        ...filter,
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
      data: products,
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
      { status: 'DELETED' },
    );
    return deleted;
  }
}
