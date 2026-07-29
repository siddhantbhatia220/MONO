/**
 * MONO — Plugins Controller
 *
 * Provides REST endpoints to manage plugins:
 *   - GET /plugins               – list installed plugins
 *   - POST /plugins/install       – install a plugin (manifest JSON in body)
 *   - POST /plugins/:id/activate  – activate plugin for a workspace
 *   - POST /plugins/:id/deactivate – deactivate plugin for a workspace
 *   - DELETE /plugins/:id         – uninstall plugin (requires workspaceId)
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common'
import { PluginsService, PluginManifest } from './plugins.service'

/**
 * DTO for installing a plugin – the full manifest is posted.
 */
export class InstallPluginDto implements PluginManifest {
  id: string
  name: string
  description: string
  entry: string
  version?: string
}

/**
 * DTO for activation/deactivation – includes the workspaceId the plugin
 * should operate against.
 */
export class WorkspaceDto {
  workspaceId: string
}

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  list() {
    return this.pluginsService.listPlugins()
  }

  @Post('install')
  async install(@Body() dto: InstallPluginDto) {
    // Basic validation – ensure required fields exist
    const required: (keyof InstallPluginDto)[] = ['id', 'name', 'description', 'entry']
    for (const key of required) {
      if (!dto[key]) {
        throw new BadRequestException(`Missing required field ${key}`)
      }
    }
    await this.pluginsService.installPlugin(dto)
    return { message: 'Plugin installed' }
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Body() body: WorkspaceDto) {
    await this.pluginsService.activatePlugin(id, body.workspaceId)
    return { message: 'Plugin activated for workspace' }
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @Body() body: WorkspaceDto) {
    await this.pluginsService.uninstallPlugin(id, body.workspaceId)
    return { message: 'Plugin deactivated for workspace' }
  }

  @Delete(':id')
  async uninstall(@Param('id') id: string, @Body() body: WorkspaceDto) {
    await this.pluginsService.uninstallPlugin(id, body.workspaceId)
    return { message: 'Plugin uninstalled' }
  }
}
