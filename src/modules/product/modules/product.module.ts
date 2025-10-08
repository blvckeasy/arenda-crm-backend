import { Module } from '@nestjs/common';
import { AccessTokenModule, CoreProductModule } from '@blvckeasy/arenda-crm-core';
import { ProductController } from '../controllers';
import { ProductService } from '../services';

@Module({
  imports: [CoreProductModule, AccessTokenModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
