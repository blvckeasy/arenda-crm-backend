import { Module } from '@nestjs/common';
import { ProductCategoryController } from '../controllers';
import { ProductCategoryService } from '../services';
import { CoreProductCategoryModule } from '@blvckeasy/arenda-crm-core';

@Module({
  imports: [CoreProductCategoryModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
