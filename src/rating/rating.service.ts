import { SetRatingDto } from './dto/set-rating.dto'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { RatingModel } from './rating.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { MovieService } from 'src/movie/movie.service'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly MovieService: MovieService
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return this.RatingModel.findOne({ movieId, userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0))
	}

	async averageRatingByMovie(movieId: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate()
			.match({ movieId: new Types.ObjectId(movieId) })
			.exec()

		return (
			ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingsMovie.length
		)
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto

		const newRating = await this.RatingModel.findOneAndUpdate(
			{ movieId, userId },
			{
				userId,
				movieId,
				value,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		).exec()

		const averageRating = await this.averageRatingByMovie(movieId)

		await this.MovieService.updateRating(movieId, averageRating)

		return newRating
	}
}
