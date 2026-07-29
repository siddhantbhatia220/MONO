// src/api/api.module.ts
/**
 * MONO — API Module
 *
 * Exposes a REST API for external integrations. All routes are guarded by the
 * existing JWT strategy. OpenAPI documentation is generated via @nestjs/swagger.
 */
import { Module } from '@nestjs/common'
import { ApiWorkspacesController, ApiItemsController } from './api.controller'
import { WorkspacesModule } from '../workspaces/workspaces.module'
import { ItemsModule } from '../items/items.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [WorkspacesModule, ItemsModule, AuthModule],
  controllers: [ApiWorkspacesController, ApiItemsController],
})
export class ApiModule {}
