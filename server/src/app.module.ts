/**
 * MONO — NestJS Root Application Module
 *
 * Registers all feature modules: Auth, Items, Workspaces, Sync, Plugins, API, ImportExport.
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ItemsModule } from './items/items.module'
import { WorkspacesModule } from './workspaces/workspaces.module'
import { SyncModule } from './sync/sync.module'
import { PluginsModule } from './plugins/plugins.module'
import { ApiModule } from './api/api.module'
import { ImportExportModule } from './import-export/import-export.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ItemsModule,
    WorkspacesModule,
    SyncModule,
    PluginsModule,
    ApiModule,
    ImportExportModule,
  ],
})
export class AppModule {}
