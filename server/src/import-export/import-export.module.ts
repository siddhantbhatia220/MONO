// src/import-export/import-export.module.ts
/**
 * MONO — Import/Export Module
 *
 * Provides endpoints to import and export workspaces, items, and plugins.
 * Export supports JSON (full fidelity) and Markdown (human‑readable).
 */
import { Module } from '@nestjs/common'
import { ImportExportController } from './import-export.controller'
import { ImportService } from './import.service'
import { ExportService } from './export.service'
import { WorkspacesService } from '../workspaces/workspaces.service'
import { ItemsService } from '../items/items.service'
import { PluginsService } from '../plugins/plugins.service'

@Module({
  controllers: [ImportExportController],
  providers: [ImportService, ExportService, WorkspacesService, ItemsService, PluginsService],
})
export class ImportExportModule {}
