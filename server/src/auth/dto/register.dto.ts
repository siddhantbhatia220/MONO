/**
 * MONO — User Registration Data Transfer Object
 */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string

  @IsString()
  @IsNotEmpty()
  name!: string
}
