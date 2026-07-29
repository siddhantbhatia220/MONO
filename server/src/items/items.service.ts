/**
 * MONO — NestJS Items Persistence & Sync Service
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItemDto, UpdateItemDto } from './dto/items.dto'

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sync Hydration: Get all items for a workspace.
   */
  async syncWorkspaceItems(workspaceId: string) {
    return this.prisma.item.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
    })
  }

  /**
   * Create item in server database.
   */
  async create(dto: CreateItemDto, userId: string) {
    const item = await this.prisma.item.create({
      data: {
        title: dto.title,
        workspaceId: dto.workspaceId,
        notes: dto.notes,
        type: dto.type || 'task',
        status: dto.status || 'active',
        priority: dto.priority || 'none',
        tags: dto.tags || [],
      },
    })

    // Log audit action
    await this.prisma.auditLog.create({
      data: {
        itemId: item.id,
        userId,
        action: 'CREATE_ITEM',
        payload: { title: item.title },
      },
    })

    return item
  }

  /**
   * Update item in server database.
   */
  async update(id: string, dto: UpdateItemDto, userId: string) {
    const existing = await this.prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Item not found')

    const updated = await this.prisma.item.update({
      where: { id },
      data: {
        title: dto.title,
        notes: dto.notes,
        status: dto.status,
        priority: dto.priority,
        tags: dto.tags,
      },
    })

    await this.prisma.auditLog.create({
      data: {
        itemId: id,
        userId,
        action: 'UPDATE_ITEM',
        payload: { changes: dto },
      },
    })

    return updated
  }

  /**
   * Delete item from server database.
   */
  async delete(id: string, userId: string) {
    const existing = await this.prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Item not found')

    await this.prisma.item.delete({ where: { id } })
    return { success: true, id }
  }
}
