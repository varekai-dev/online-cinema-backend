import { TelegramModule } from './../telegram/telegram.module'
import { TypegooseModule } from 'nestjs-typegoose'
import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { MovieModel } from './movie.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
		]),
		TelegramModule,
	],
	controllers: [MovieController],
	providers: [MovieService],
	exports: [MovieService],
})
export class MovieModule {}
