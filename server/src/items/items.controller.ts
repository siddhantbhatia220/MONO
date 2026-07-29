/**
 * MONO — NestJS Items REST Controller
 */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ItemsService } from './items.service'
import { CreateItemDto, UpdateItemDto } from './dto/items.dto'

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('sync/:workspaceId')
  async syncWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.itemsService.syncWorkspaceItems(workspaceId)
  }

  @Post()
  async create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto, 'system-user')
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto, 'system-user')
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.itemsService.delete(id, 'system-user')
  }
}
