import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'sk-sweets', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
}

export function getOptimizedUrl(url: string, width = 800): string {
  if (url.includes('cloudinary.com')) {
    // Adds automatic formatting and quality optimization
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }
  return url;
}
