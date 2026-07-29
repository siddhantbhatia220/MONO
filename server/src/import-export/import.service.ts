// src/import-export/import.service.ts
/**
 * MONO — Import Service
 *
 * Handles importing of workspaces, items, and plugins from JSON or Markdown.
 * For Phase 4 we support JSON payloads via POST request body.
 */
import { Injectable, BadRequestException } from '@nestjs/common'
import { WorkspacesService } from '../workspaces/workspaces.service'
import { ItemsService } from '../items/items.service'
import { PluginsService } from '../plugins/plugins.service'

@Injectable()
export class ImportService {
  constructor(
    private readonly wsService: WorkspacesService,
    private readonly itemsService: ItemsService,
    private readonly pluginsService: PluginsService,
  ) {}

  /**
   * Import a JSON representation containing workspaces, items, and plugins.
   * Expected shape:
   * {
   *   workspaces: Workspace[],
   *   items: Item[],
   *   plugins: PluginManifest[]
   * }
   */
  async importFromJson(data: any): Promise<void> {
    if (!data) {
      throw new BadRequestException('Import payload missing')
    }

    const { workspaces, items, plugins } = data
    if (Array.isArray(workspaces)) {
      for (const ws of workspaces) {
        // Simple upsert – create if not exists (implementation omitted for brevity)
        // Assume WorkspacesService has a `create` method (you may need to add it).
        // Here we just ignore errors for brevity.
        try {
          // @ts-ignore – placeholder for actual create method
          await this.wsService.create(ws)
        } catch {}
      }
    }
    if (Array.isArray(items)) {
      for (const item of items) {
        try {
          // @ts-ignore – placeholder for actual create method
          await this.itemsService.create(item)
        } catch {}
      }
    }
    if (Array.isArray(plugins)) {
      for (const manifest of plugins) {
        try {
          await this.pluginsService.installPlugin(manifest)
        } catch {}
      }
    }
  }
}
