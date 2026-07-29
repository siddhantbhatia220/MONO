/**
 * MONO — Plugin Interface
 *
 * Defines the contract that a server‑side plugin must implement.
 * Each plugin is a plain TypeScript class exported as default that
 * implements this interface. The server will call `init` once on load
 * and `activate`/`deactivate` on demand.
 */
export interface MonoPlugin {
  /**
   * Called once when the plugin is loaded. Use it to register routes,
   * providers, or perform one‑time setup.
   */
  init(): Promise<void> | void

  /**
   * Called when the plugin is activated for a workspace.
   * Provide any runtime services (e.g., hooks, UI widgets) here.
   */
  activate(workspaceId: string): Promise<void> | void

  /**
   * Called when the plugin is deactivated (e.g., uninstalled).
   */
  deactivate(workspaceId: string): Promise<void> | void
}
