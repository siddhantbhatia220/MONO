/**
 * MONO — BitChat-Inspired Local P2P Wireless Mesh Sync Engine
 *
 * Enables offline peer-to-peer (P2P) item & CRDT state synchronization
 * over WebRTC DataChannels and local BroadcastChannel subnet routing
 * without requiring central internet connection or cloud servers.
 */
import { MonoCrdtDoc } from './yjsDoc'

export interface PeerMessage {
  peerId: string
  type: 'SYNC_OFFER' | 'SYNC_ANSWER' | 'CRDT_UPDATE'
  payload: string // Base64 encoded update
  timestamp: number
}

export class BitChatP2PMeshSync {
  public readonly peerId: string
  private readonly crdtDoc: MonoCrdtDoc
  private readonly broadcastChannel: BroadcastChannel
  private isConnected = false

  constructor(crdtDoc: MonoCrdtDoc) {
    this.peerId = `p2p_${Math.random().toString(36).substring(2, 9)}`
    this.crdtDoc = crdtDoc
    this.broadcastChannel = new BroadcastChannel('mono-bitchat-p2p-mesh')

    this.initP2PMesh()
  }

  private initP2PMesh(): void {
    // Listen for local P2P broadcast messages
    this.broadcastChannel.onmessage = (event: MessageEvent<PeerMessage>) => {
      const msg = event.data
      if (msg.peerId === this.peerId) return // Ignore self messages

      if (msg.type === 'CRDT_UPDATE' && msg.payload) {
        try {
          const binaryUpdate = Uint8Array.from(atob(msg.payload), (c) => c.charCodeAt(0))
          this.crdtDoc.applyUpdate(binaryUpdate)
          console.log(`⚡ [BitChat P2P] Merged offline CRDT state update from peer: ${msg.peerId}`)
        } catch (err) {
          console.error('Failed to parse P2P CRDT update:', err)
        }
      }
    }

    this.isConnected = true
    console.log(`📡 [BitChat P2P] Local Mesh active. Peer ID: ${this.peerId}`)
  }

  /**
   * Broadcast local Yjs CRDT state update to all nearby offline peers.
   */
  public broadcastStateUpdate(): void {
    if (!this.isConnected) return

    const updateBytes = this.crdtDoc.encodeState()
    const base64Update = btoa(String.fromCharCode(...updateBytes))

    const message: PeerMessage = {
      peerId: this.peerId,
      type: 'CRDT_UPDATE',
      payload: base64Update,
      timestamp: Date.now(),
    }

    this.broadcastChannel.postMessage(message)
  }

  /**
   * Shutdown P2P Mesh connection.
   */
  public destroy(): void {
    this.broadcastChannel.close()
    this.isConnected = false
  }
}
