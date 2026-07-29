/**
 * MONO — Plugins Module
 *
 * Registers the PluginsService and PluginsController.
 */
import { Module } from '@nestjs/common'
import { PluginsService } from './plugins.service'
import { PluginsController } from './plugins.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [PluginsService, PrismaService],
  controllers: [PluginsController],
  exports: [PluginsService],
})
export class PluginsModule {}
