import { ICollection } from './genre.interface'
import { MovieService } from 'src/movie/movie.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly MovieService: MovieService
	) {}

	async bySlug(slug: string) {
		const findSlug = await this.GenreModel.findOne({ slug }).exec()

		if (!findSlug) throw new NotFoundException('Slug not found')

		return findSlug
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			}
		}
		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: -1,
			})
			.exec()
	}

	async getCollections(): Promise<ICollection[]> {
		const genres = await this.getAll()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.MovieService.byGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					title: genre.name,
					slug: genre.slug,
					image: moviesByGenre[0]?.bigPoster || null,
				}

				return result
			})
		)

		return collections
	}

	//Admin

	async byId(id: string) {
		const genre = await this.GenreModel.findById(id).exec()

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async getCount() {
		return this.GenreModel.find().count().exec()
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Genre not found')

		return updateDoc
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			description: '',
			name: '',
			slug: '',
			icon: '',
		}
		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async delete(_id: string) {
		const deleteDoc = this.GenreModel.findByIdAndDelete(_id).exec()

		if (!deleteDoc) throw new NotFoundException('Genre not found')

		return deleteDoc
	}
}
