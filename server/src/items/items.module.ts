/**
 * MONO — NestJS Items Module
 */
import { Module } from '@nestjs/common'
import { ItemsController } from './items.controller'
import { ItemsService } from './items.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService],
  exports: [ItemsService],
})
export class ItemsModule {}
