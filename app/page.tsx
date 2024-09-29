'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Camera, Download, Loader2, Settings } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

const FullscreenCaptureApp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [options, setOptions] = useState({
    width: 1920,
    height: 1080,
    fullPage: true,
    format: 'png',
    url: '',
    captureResult: '',
  })

  const captureContent = async () => {
    if (!options.url) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/capture-content?${new URLSearchParams({
          ...(options as any),
        })}`
      )

      if (!response.ok) {
        throw new Error('Failed to capture content')
      }

      const blob = await response.blob()
      const resultUrl = URL.createObjectURL(blob)
      setOptions({ ...options, captureResult: resultUrl })
    } catch (err) {
      setError('Failed to capture content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadResult = () => {
    const a = document.createElement('a')
    a.href = options.captureResult
    a.download = `capture.${options.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-4xl'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold text-center'>
            Website Content Capture
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex space-x-4'>
            <Input
              type='url'
              placeholder='Enter website URL'
              value={options.url}
              onChange={(e) => setOptions({ ...options, url: e.target.value })}
              className='flex-grow'
            />
            <Button
              onClick={captureContent}
              disabled={loading}
              className='w-40'
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className='mr-2 h-4 w-4' />
                  Capture
                </>
              )}
            </Button>
          </div>

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='options'>
              <AccordionTrigger>
                <Settings className='mr-2 h-4 w-4' />
                Capture Options
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-4'>
                    <Label htmlFor='format' className='w-24'>
                      Format:
                    </Label>
                    <Select
                      value={options.format}
                      onValueChange={(value) =>
                        setOptions({
                          ...options,
                          format: value,
                          captureResult: '',
                        })
                      }
                    >
                      <SelectTrigger id='format'>
                        <SelectValue placeholder='Select format' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='png'>PNG</SelectItem>
                        <SelectItem value='jpeg'>JPEG</SelectItem>
                        <SelectItem value='pdf'>PDF</SelectItem>
                        <SelectItem value='html'>HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <Label htmlFor='fullPage' className='w-24'>
                      Full Page:
                    </Label>
                    <Switch
                      id='fullPage'
                      checked={options.fullPage}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, fullPage: checked })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='width'>Width: {options.width}px</Label>
                    <Slider
                      id='width'
                      min={320}
                      max={3840}
                      color='primary'
                      value={[options.width]}
                      onValueChange={([value]) =>
                        setOptions({ ...options, width: value })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='height'>Height: {options.height}px</Label>
                    <Slider
                      id='height'
                      min={240}
                      max={2160}
                      step={1}
                      value={[options.height]}
                      onValueChange={([value]) =>
                        setOptions({ ...options, height: value })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {options.captureResult && (
            <div className='space-y-4'>
              {options.format === 'png' || options.format === 'jpeg' ? (
                <img
                  src={options.captureResult}
                  alt='Captured Content'
                  className='w-full rounded-lg shadow-lg'
                />
              ) : options.format === 'pdf' ? (
                <embed
                  src={options.captureResult}
                  type='application/pdf'
                  width='100%'
                  height='600px'
                />
              ) : options.format === 'html' ? (
                <div className='mt-6'>
                  <h2 className='text-xl font-semibold'>
                    Captured HTML Preview:
                  </h2>
                  <Link href={options.captureResult} target='_blank'>
                    {options.captureResult}
                  </Link>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Content captured successfully. Click the download button to
                    save it.
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={downloadResult} className='w-full'>
                <Download className='mr-2 h-4 w-4' />
                Download Captured Content
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className='text-center text-sm text-gray-500'>
          Enter a URL, adjust options if needed, and click 'Capture' to capture
          the website content.
        </CardFooter>
      </Card>
    </div>
  )
}

export default FullscreenCaptureApp
