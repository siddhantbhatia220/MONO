/**
 * MONO — NestJS Real-Time WebSockets Yjs Sync Gateway
 */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'ws'

@WebSocketGateway({
  namespace: 'sync',
  cors: { origin: '*' },
})
export class SyncGateway {
  @WebSocketServer()
  server!: Server

  @SubscribeMessage('crdt_update')
  handleCrdtUpdate(@MessageBody() payload: { workspaceId: string; update: string }): void {
    // Broadcast CRDT state binary update to all active workspace subscribers
    if (this.server && this.server.clients) {
      this.server.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'CRDT_UPDATE', payload }))
        }
      })
    }
  }
}
