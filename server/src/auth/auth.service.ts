/**
 * MONO — NestJS Authentication Service
 * Handles user registration, Argon2 password hashing, login, and JWT signing.
 */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
    avatarUrl?: string | null
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Register a new user and create their default workspace.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    if (existing) {
      throw new ConflictException('User with this email already exists')
    }

    const passwordHash = await argon2.hash(dto.password)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
      },
    })

    // Create default personal workspace
    const workspace = await this.prisma.workspace.create({
      data: {
        name: 'Personal Workspace',
        icon: 'Folder',
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    })

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    }
  }

  /**
   * Login user with email and password.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const validPassword = await argon2.verify(user.passwordHash, dto.password)
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    }
  }

  /**
   * Validate token payload user.
   */
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true },
    })
  }
}
