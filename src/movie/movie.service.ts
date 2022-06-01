import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [{ title: new RegExp(searchTerm, 'i') }],
			}
		}

		//Aggregation

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: -1,
			})
			.populate('actors genres')
			.exec()
	}

	async byActor(actorId: Types.ObjectId) {
		const moviesByActor = await this.MovieModel.find({ actors: actorId })
			.populate('actors genres')
			.exec()
		if (!moviesByActor) throw new NotFoundException('Movies not found')
		return moviesByActor
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		const findSlug = await this.MovieModel.find({
			genres: { $in: genreIds },
		}).exec()
		if (!findSlug) throw new NotFoundException('Movies not found')
		return findSlug
	}

	async bySlug(slug: string) {
		const findSlug = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!findSlug) throw new NotFoundException('Movies not found')
		return findSlug
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			},
			{
				new: true,
			}
		).exec()
		if (!updateDoc) throw new NotFoundException('Movie not found')

		return updateDoc
	}

	async getMostPopular() {
		const movies = await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
		if (!movies) throw new NotFoundException('Movies not found')
		return movies
	}

	async updateRating(id: string, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{ rating: newRating },
			{ new: true }
		).exec()
	}
	//Admin

	async byId(id: string) {
		const movie = await this.MovieModel.findById(id).exec()
		if (!movie) throw new NotFoundException('Movies not found')
		return movie
	}

	async getCount() {
		return this.MovieModel.find().count().exec()
	}

	async update(_id: string, dto: UpdateMovieDto) {
		//Telegram notification
		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Movie not found')

		return updateDoc
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			poster: '',
			bigPoster: '',
			title: '',
			description: '',
			slug: '',
			videoUrl: '',
			genres: [],
			actors: [],
		}
		const actor = await this.MovieModel.create(defaultValue)
		return actor._id
	}

	async delete(_id: string) {
		const deleteDoc = this.MovieModel.findByIdAndDelete(_id).exec()
		if (!deleteDoc) throw new NotFoundException('Movie not found')
		return deleteDoc
	}
}
