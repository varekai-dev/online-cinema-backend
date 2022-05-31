import { Injectable, BadRequestException } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { FileResponse } from './interface.dto'
@Injectable()
export class FileService {
	constructor(private cloudinary: CloudinaryService) {}
	async uploadImageToCloudinary(
		file: Express.Multer.File,
		folder: string = 'default'
	) {
		const response = await this.cloudinary.uploadData(file, folder)
		return {
			url: response.secure_url,
			name: file.originalname,
		}
	}

	// async saveFiles(
	// 	files: Express.Multer.File[],
	// 	folder: string = 'default'
	// ): Promise<FileResponse[]> {
	// 	const uploadFolder = `${path}/uploads/${folder}`
	// 	await ensureDir(uploadFolder)
	// 	const res: FileResponse[] = await Promise.all(
	// 		files.map(async (file) => {
	// 			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
	// 			return {
	// 				url: `/uploads/${folder}/${file.originalname}`,
	// 				name: file.originalname,
	// 			}
	// 		})
	// 	)

	// 	return res
	// }
}
