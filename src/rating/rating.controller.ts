import { SetRatingDto } from './dto/set-rating.dto'
import { Types } from 'mongoose'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/user/decorators/user.decorators'
import { RatingService } from './rating.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get(':movieId')
	@HttpCode(200)
	@Auth()
	async getMovieValueByUser(
		@User('_id') userId: Types.ObjectId,
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId
	) {
		return this.ratingService.getMovieValueByUser(movieId, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setRating(
		@User('_id') userId: Types.ObjectId,
		@Body()
		dto: SetRatingDto
	) {
		return this.ratingService.setRating(userId, dto)
	}
}
