/**
 * MONO — NestJS Backend Server Entrypoint
 */
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableCors({
    origin: '*',
    credentials: true,
  })

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`⚡ MONO NestJS Backend Server running on http://localhost:${port}`)
}

bootstrap()
