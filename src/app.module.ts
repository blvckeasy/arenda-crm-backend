import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/product/product.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [UsersModule, ProductModule, ProductCategoryModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
