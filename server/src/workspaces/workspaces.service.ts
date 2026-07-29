/**
 * MONO — NestJS Workspace Service
 *
 * Server-side workspace CRUD and member management.
 */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all workspaces the user is a member of.
   */
  async listForUser(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    })
    return memberships.map((m) => ({
      ...m.workspace,
      role: m.role,
    }))
  }

  /**
   * Get workspace by ID with member list.
   */
  async getById(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: { include: { user: { select: { id: true, email: true, name: true, avatarUrl: true } } } },
        projects: true,
      },
    })
    if (!workspace) throw new NotFoundException('Workspace not found')
    return workspace
  }

  /**
   * Add a member to a workspace by email.
   */
  async addMember(workspaceId: string, email: string, role: 'EDITOR' | 'VIEWER') {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) throw new NotFoundException('User not found with that email')

    const existing = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
    })
    if (existing) throw new ForbiddenException('User is already a member')

    return this.prisma.workspaceMember.create({
      data: { workspaceId, userId: user.id, role },
    })
  }

  /**
   * Remove a member from a workspace.
   */
  async removeMember(workspaceId: string, memberId: string) {
    return this.prisma.workspaceMember.delete({ where: { id: memberId } })
  }
}
