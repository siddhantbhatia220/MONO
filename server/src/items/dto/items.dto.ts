/**
 * MONO — Item Data Transfer Objects for NestJS Server
 */
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { ItemStatus, ItemType, Priority } from '@prisma/client'

export class CreateItemDto {
  @IsString()
  title!: string

  @IsString()
  workspaceId!: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsEnum(ItemType)
  type?: ItemType

  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @IsOptional()
  @IsArray()
  tags?: string[]
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @IsOptional()
  @IsArray()
  tags?: string[]
}
