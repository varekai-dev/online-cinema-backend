import { ConfigService } from '@nestjs/config'

export const getCloudinaryConfig = async (configService: ConfigService) => ({
	cloud_name: configService.get('CCLOUDINARY_CLOUD_NAME'),
	api_key: configService.get('CLOUDINARY_API_KEY'),
	api_secret: configService.get('CLOUDINARY_API_SECRET'),
})
