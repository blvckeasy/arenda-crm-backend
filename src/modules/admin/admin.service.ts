import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateAdminDto, FilterAdminDto, FindAllDto, FindOneDto, UpdateAdminDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateAdminDto) {
    const newAdmin = await this.prismaService.admin.create({ data: dto });
    return newAdmin;
  }

  async findAll(dto?: FindAllDto) {
    const admins = await this.prismaService.admin.findMany({ where: dto, orderBy: { id: 'asc' } });
    return admins;
  }

  async findOne(dto?: FindOneDto) {
    const admin = await this.prismaService.admin.findFirst({ where: dto });
    return admin;
  }

  async update (id: number, dto: UpdateAdminDto) {
    const updatedAdmin = await this.prismaService.admin.update({ where: { id }, data: dto });
    return updatedAdmin;
  }

  async remove(id: number) {
    const deletedAdmin = await this.prismaService.admin.delete({ where: { id } });
    return deletedAdmin;
  }

  async countDocuments(filter: FilterAdminDto) {
    const count = await this.prismaService.admin.count({ where: filter });
    return count;
  }
}
