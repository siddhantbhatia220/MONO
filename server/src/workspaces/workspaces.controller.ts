/**
 * MONO — NestJS Workspaces REST Controller
 */
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get(':id')
  async getWorkspace(@Param('id') id: string) {
    return this.workspacesService.getById(id)
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() body: { email: string; role: 'EDITOR' | 'VIEWER' }
  ) {
    return this.workspacesService.addMember(id, body.email, body.role)
  }

  @Delete(':id/members/:memberId')
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.workspacesService.removeMember(id, memberId)
  }
}
