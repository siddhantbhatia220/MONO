// src/lib/types/plugin.ts
/**
 * Types for plugin manifests and runtime instances.
 */
export interface PluginManifest {
  /** Unique identifier */
  id: string
  /** Human readable name */
  name: string
  /** Short description shown in the marketplace */
  description: string
  /** Relative path to the compiled plugin entry point */
  entry: string
  /** Optional version string */
  version?: string
}

/** Runtime plugin instance (implements the server‑side MonoPlugin interface) */
export interface MonoPluginRuntime {
  init(): Promise<void> | void
  activate(workspaceId: string): Promise<void> | void
  deactivate(workspaceId: string): Promise<void> | void
}
