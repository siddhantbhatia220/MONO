// src/api/api.controller.ts
/**
 * MONO — API Controller
 *
 * Exposes public REST endpoints for workspaces and items.
 * All routes are guarded by JwtAuthGuard.
 */
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { WorkspacesService } from '../workspaces/workspaces.service'
import { ItemsService } from '../items/items.service'
import { CreateWorkspaceDto } from '../workspaces/dto/create-workspace.dto'
import { CreateItemDto } from '../items/dto/items.dto'

@ApiTags('Workspaces')
@UseGuards(JwtAuthGuard)
@Controller('api/workspaces')
export class ApiWorkspacesController {
  constructor(private readonly wsService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created' })
  create(@Body() dto: CreateWorkspaceDto) {
    return this.wsService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  get(@Param('id') id: string) {
    return this.wsService.getById(id)
  }
}

@ApiTags('Items')
@UseGuards(JwtAuthGuard)
@Controller('api/items')
export class ApiItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  get(@Param('id') id: string) {
    return this.itemsService.getById(id)
  }
}
