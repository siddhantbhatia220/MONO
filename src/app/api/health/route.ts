import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    developer: 'Siddhant Bhatia',
    project: 'MONO Personal OS',
  })
}
