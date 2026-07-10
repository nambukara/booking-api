import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Service } from '../../generated/prisma/client';

@Injectable()
export class ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prisma.service.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ServiceWhereInput;
    orderBy?: Prisma.ServiceOrderByWithRelationInput;
  }): Promise<Service[]> {
    return this.prisma.service.findMany(params);
  }

  async count(params: { where?: Prisma.ServiceWhereInput }): Promise<number> {
    return this.prisma.service.count(params);
  }

  async findUnique(params: {
    where: Prisma.ServiceWhereUniqueInput;
  }): Promise<Service | null> {
    return this.prisma.service.findUnique(params);
  }

  async update(params: {
    where: Prisma.ServiceWhereUniqueInput;
    data: Prisma.ServiceUpdateInput;
  }): Promise<Service> {
    return this.prisma.service.update(params);
  }

  async delete(params: {
    where: Prisma.ServiceWhereUniqueInput;
  }): Promise<Service> {
    return this.prisma.service.delete(params);
  }
}
