/**
 * MONO — Create Workspace Data Transfer Object
 */
import { IsOptional, IsString } from 'class-validator'

export class CreateWorkspaceDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string
}
