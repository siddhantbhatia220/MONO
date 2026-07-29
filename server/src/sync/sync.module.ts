/**
 * MONO — NestJS Sync Module
 */
import { Module } from '@nestjs/common'
import { SyncGateway } from './sync.gateway'

@Module({
  providers: [SyncGateway],
  exports: [SyncGateway],
})
export class SyncModule {}
