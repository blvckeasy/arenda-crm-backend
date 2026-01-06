import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
}
