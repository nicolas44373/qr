import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '../../../lib/cloudinary'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convertir el archivo a base64 para Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    // Subir a Cloudinary
    const imageUrl = await uploadImage(base64Data)

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error uploading image' }, 
      { status: 500 }
    )
  }
}