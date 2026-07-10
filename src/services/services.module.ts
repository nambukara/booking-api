import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './services.repository';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService], // If we need it in BookingsModule later
})
export class ServicesModule {}
