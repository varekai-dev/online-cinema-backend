import { MovieModule } from 'src/movie/movie.module'
import { GenreModel } from './genre.model'
import { Module } from '@nestjs/common'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
		]),
		MovieModule,
	],
	controllers: [GenreController],
	providers: [GenreService],
})
export class GenreModule {}
