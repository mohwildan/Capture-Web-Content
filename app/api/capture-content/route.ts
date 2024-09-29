import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

const RATE_LIMIT = 5 // requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const ipRequestCounts = new Map()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const headers = req.headers
  const url = searchParams.get('url')
  const format = searchParams.get('format') || 'png'
  let width = parseInt(searchParams.get('width') || '1280')
  let height = parseInt(searchParams.get('height') || '800')
  const fullPage = searchParams.get('fullPage') === 'true'
  const clientIp = headers.get('x-forwarded-for') || req.ip

  try {
    if (!url) {
      return NextResponse.json({ error: 'URL is required' })
    }

    // Rate limiting
    const now = Date.now()
    const windowStart = now - RATE_LIMIT_WINDOW
    const requestTimestamps = ipRequestCounts.get(clientIp) || []
    const requestsInWindow = requestTimestamps.filter(
      (timestamp: number) => timestamp > windowStart
    )
    if (requestsInWindow.length >= RATE_LIMIT) {
      return NextResponse.json({ error: 'Rate limit exceeded' })
    }
    ipRequestCounts.set(clientIp, [...requestsInWindow, now])

    console.log(
      `IP: ${clientIp} - Requests in window: ${requestsInWindow.length}`
    )

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })
    await page.setViewport({ width, height })

    let content: Buffer | string | Uint8Array
    let contentType: string

    switch (format.toLowerCase()) {
      case 'pdf':
        content = await page.pdf({
          format: 'A4',
          printBackground: true,
        })
        contentType = 'application/pdf'
        break
      case 'jpeg':
        content = await page.screenshot({
          type: 'jpeg',
          fullPage,
          quality: 80,
        })
        contentType = 'image/jpeg'
        break
      case 'html':
        content = await page.content()
        contentType = 'text/html'
        break
      case 'png':
      default:
        content = await page.screenshot({
          type: 'png',
          fullPage,
        })
        contentType = 'image/png'
        break
    }

    await browser.close()

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=capture.${format}`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to capture content' })
  }
}
