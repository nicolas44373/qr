import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'catalogo-productos',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' }
      ]
    })
    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

// Función para extraer public_id de una URL de Cloudinary
export const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/)
  return matches ? matches[1] : null
}