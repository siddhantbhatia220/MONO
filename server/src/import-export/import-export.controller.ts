/**
 * MONO — Import/Export Controller
 *
 * REST Endpoints:
 *   - GET /api/export/:workspaceId  — Export full workspace data as JSON
 *   - POST /api/import               — Import workspace JSON payload
 */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ExportService } from './export.service'
import { ImportService } from './import.service'

@ApiTags('Import/Export')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ImportExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly importService: ImportService
  ) {}

  @Get('export/:workspaceId')
  @ApiOperation({ summary: 'Export workspace items and structure as JSON' })
  async exportWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.exportService.exportWorkspaceAsJson(workspaceId)
  }

  @Post('import')
  @ApiOperation({ summary: 'Import items and workspace data from JSON' })
  async importWorkspace(@Body() data: any) {
    await this.importService.importFromJson(data)
    return { success: true, message: 'Data imported successfully' }
  }
}
