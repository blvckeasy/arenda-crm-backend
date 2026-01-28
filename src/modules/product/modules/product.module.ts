import { Module } from '@nestjs/common';
import { AccessTokenModule, CoreContractModule, CoreProductModule } from '@blvckeasy/arenda-crm-core';
import { ProductController } from '../controllers';
import { ProductService } from '../services';
import { ProductCategoryModule } from './product-category.module';
import { RequestQueryBuilder } from '../../../common';

@Module({
  imports: [CoreProductModule, CoreContractModule, ProductCategoryModule, AccessTokenModule],
  controllers: [ProductController],
  providers: [ProductService, RequestQueryBuilder],
  exports: [ProductService],
})
export class ProductModule {}
