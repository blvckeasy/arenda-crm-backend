import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies';
import { 
  AccessTokenModule, 
  CoreCreditorModule, 
  CorePasswordModule
} from '@blvckeasy/arenda-crm-core';

@Module({
  imports: [
    ConfigModule, 
    AccessTokenModule, 
    CoreCreditorModule, 
    CorePasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy], 
})
export class AuthModule {}