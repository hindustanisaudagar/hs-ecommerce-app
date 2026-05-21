import { v2 as cloudinary } from 'cloudinary'

let cloudinaryConfigured = false

function ensureConfigured() {
  if (!cloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    })
    cloudinaryConfigured = true
  }
}

export async function uploadImage(file: Buffer, folder: string = 'products') {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hindustani-saudagar/${folder}`,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(file)
  })
}

export async function uploadVideo(file: Buffer, folder: string = 'products') {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hindustani-saudagar/${folder}`,
        resource_type: 'video',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(file)
  })
}

export async function deleteImage(publicId: string) {
  ensureConfigured()
  return cloudinary.uploader.destroy(publicId)
}

export function getImageUrl(publicId: string, transformations: any[] = []) {
  ensureConfigured()
  return cloudinary.url(publicId, {
    transformation: transformations,
  })
}
