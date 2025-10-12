import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import { redisStore } from 'cache-manager-redis-yet';
import { 
  AuthModule, 
  ProductModule, 
  ProductCategoryModule,
  CustomerModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ session: false }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000,
      store: redisStore,
    }),
    AuthModule,
    ProductModule,
    ProductCategoryModule,
    CustomerModule,
  ],
})
export class AppModule {}
