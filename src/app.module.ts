// src/app.module.ts
import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataGateway } from './gateway/data.gateway';

@Module({
  imports: [],
  providers: [DataService, DataGateway],
})
export class AppModule {}
