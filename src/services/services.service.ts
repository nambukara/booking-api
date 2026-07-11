import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesRepository } from './services.repository';
import { Service } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private repository: ServicesRepository) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.repository.create({
      title: createServiceDto.title,
      description: createServiceDto.description,
      duration: createServiceDto.duration,
      price: createServiceDto.price,
      is_active: createServiceDto.isActive,
    });
  }

  async findAll(): Promise<Service[]> {
    return this.repository.findMany({});
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.repository.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    await this.findOne(id);
    return this.repository.update({
      where: { id },
      data: {
        title: updateServiceDto.title,
        description: updateServiceDto.description,
        duration: updateServiceDto.duration,
        price: updateServiceDto.price,
        is_active: updateServiceDto.isActive,
      },
    });
  }

  async remove(id: number): Promise<Service> {
    await this.findOne(id);
    return this.repository.delete({ where: { id } });
  }
}

