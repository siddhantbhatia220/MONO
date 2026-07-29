// src/import-export/export.service.ts
/**
 * MONO — Export Service
 *
 * Generates JSON (and optionally Markdown) representations of the current
 * workspace, its items, and installed plugins.
 */
import { Injectable } from '@nestjs/common'
import { WorkspacesService } from '../workspaces/workspaces.service'
import { ItemsService } from '../items/items.service'
import { PluginsService } from '../plugins/plugins.service'

@Injectable()
export class ExportService {
  constructor(
    private readonly wsService: WorkspacesService,
    private readonly itemsService: ItemsService,
    private readonly pluginsService: PluginsService,
  ) {}

  /**
   * Export the full workspace data as JSON.
   * Caller provides the workspaceId to scope the export.
   */
  async exportWorkspaceAsJson(workspaceId: string): Promise<any> {
    const workspace = await this.wsService.getById(workspaceId)
    const items = await this.itemsService.listByWorkspace(workspaceId)
    const plugins = this.pluginsService.listPlugins()
    return {
      workspace,
      items,
      plugins,
    }
  }
}
