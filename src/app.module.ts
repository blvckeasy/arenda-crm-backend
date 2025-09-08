import { Module } from '@nestjs/common';
import { AdminModule, PrismaModule, ProductCategoryModule, ProductModule, UsersModule } from './modules';


@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProductModule,
    ProductCategoryModule,
    AdminModule,
  ],
})
export class AppModule {}
