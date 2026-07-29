/**
 * MONO — NestJS Workspaces Module
 */
import { Module } from '@nestjs/common'
import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService, PrismaService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
