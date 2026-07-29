/**
 * MONO — User Login Data Transfer Object
 */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
