import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  async register(@Body() dto: CreateAdminDto) {
    return await this.adminService.create(dto);
  }

  @Post('login')
  async login (@Body() dto: LoginAdminDto) {
    const foundedAdmin = await this.adminService.findOne(dto);
    return foundedAdmin;
  }
}
