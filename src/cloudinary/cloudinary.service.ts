import { Injectable } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import { Readable } from 'stream'
@Injectable()
export class CloudinaryService {
	async uploadData(
		file: Express.Multer.File,
		folder: string
	): Promise<UploadApiResponse | UploadApiErrorResponse> {
		return new Promise((resolve, reject) => {
			const upload = v2.uploader.upload_stream(
				{
					folder: folder,
					resource_type: 'auto',
					public_id: file.originalname.replace(/\.[^/.]+$/, ''),
				},
				(error, result) => {
					if (error) return reject(error)
					resolve(result)
				}
			)
			Readable.from(file.buffer).pipe(upload) // covert buffer to readable stream and  ass to upload
		})
	}
}
