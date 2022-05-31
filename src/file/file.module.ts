import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'app-root-path'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
	imports: [
		CloudinaryModule,
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads',
		}),
	],
	controllers: [FileController],
	providers: [FileService],
})
export class FileModule {}
