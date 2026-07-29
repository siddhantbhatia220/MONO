/**
 * MONO — Plugins Service
 *
 * Loads plugin manifests from `src/plugins/manifests` directory, validates them,
 * dynamically imports the plugin module, and registers it with the runtime.
 *
 * The service maintains an in‑memory registry of loaded plugins. For a full
 * production implementation you would persist this information in the database,
 * but for Phase 4 a simple map suffices.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { join, extname } from 'path'
import { readdir, readFile } from 'fs/promises'
import { MonoPlugin } from './plugin.interface'

/**
 * Shape of a plugin manifest file.
 */
export interface PluginManifest {
  /** Unique identifier for the plugin */
  id: string
  /** Human‑readable name */
  name: string
  /** Description shown in the marketplace */
  description: string
  /** Relative path (from the manifest) to the compiled JS/TS module */
  entry: string
  /** Optional version string */
  version?: string
}

@Injectable()
export class PluginsService {
  /** In‑memory registry of loaded plugins */
  private readonly plugins = new Map<string, { manifest: PluginManifest; instance: MonoPlugin }>()

  /** Directory that contains plugin manifest JSON files */
  private readonly manifestDir = join(__dirname, 'manifests')

  /** Load all manifests from the manifests directory */
  async loadManifests(): Promise<PluginManifest[]> {
    const files = await readdir(this.manifestDir)
    const manifests: PluginManifest[] = []
    for (const file of files) {
      if (extname(file) !== '.json') continue
      const raw = await readFile(join(this.manifestDir, file), 'utf-8')
      try {
        const manifest: PluginManifest = JSON.parse(raw)
        manifests.push(manifest)
      } catch (e) {
        throw new BadRequestException(`Invalid JSON in manifest ${file}`)
      }
    }
    return manifests
  }

  /** Install a plugin from its manifest (adds to registry and calls init) */
  async installPlugin(manifest: PluginManifest): Promise<void> {
    if (this.plugins.has(manifest.id)) {
      throw new BadRequestException(`Plugin ${manifest.id} already installed`)
    }

    // Resolve the module path relative to the manifest directory
    const modulePath = join(this.manifestDir, manifest.entry)
    let pluginModule: any
    try {
      pluginModule = await import(modulePath)
    } catch (e) {
      throw new BadRequestException(`Failed to import plugin module at ${manifest.entry}: ${e.message}`)
    }

    const pluginInstance: MonoPlugin = pluginModule.default ?? pluginModule
    if (!pluginInstance || typeof pluginInstance.init !== 'function') {
      throw new BadRequestException('Plugin does not implement required MonoPlugin interface')
    }

    // Initialise the plugin (global init)
    await pluginInstance.init()
    this.plugins.set(manifest.id, { manifest, instance: pluginInstance })
  }

  /** Uninstall a plugin – calls deactivate and removes it from the registry */
  async uninstallPlugin(pluginId: string, workspaceId: string): Promise<void> {
    const stored = this.plugins.get(pluginId)
    if (!stored) {
      throw new NotFoundException(`Plugin ${pluginId} not found`)
    }
    await stored.instance.deactivate(workspaceId)
    this.plugins.delete(pluginId)
  }

  /** Activate a plugin for a specific workspace */
  async activatePlugin(pluginId: string, workspaceId: string): Promise<void> {
    const stored = this.plugins.get(pluginId)
    if (!stored) {
      throw new NotFoundException(`Plugin ${pluginId} not found`)
    }
    await stored.instance.activate(workspaceId)
  }

  /** List installed plugins */
  listPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map((p) => p.manifest)
  }
}
