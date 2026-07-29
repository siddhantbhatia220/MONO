/**
 * MONO — NestJS Root Application Module
 *
 * Registers all feature modules: Auth, Items, and Sync.
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ItemsModule } from './items/items.module'
import { SyncModule } from './sync/sync.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ItemsModule,
    SyncModule,
  ],
})
export class AppModule {}
